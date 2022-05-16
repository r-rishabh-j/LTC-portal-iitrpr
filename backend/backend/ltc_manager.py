import json
from . import db
from . import filemanager
from .analyse import analyse
from datetime import datetime
from flask_jwt_extended import current_user
from flask import jsonify, request, make_response
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import desc
from flask_restful import Resource, abort, fields
from .models import LTCOfficeOrders, LTCProofUploads, StageUsers, Stages
from .role_manager import Permissions, role_required, roles_required, check_role
from .models import ApplicationStatus, EstablishmentLogs, EstablishmentReview, LTCApproved,\
    Users, LTCRequests, Departments, AdvanceRequests, get_stage_roles
from . import emailmanager
from . import MAX_UPLOAD_SIZE


class LtcManager:
    class ApplyForLTC(Resource):
        """
        API for applying for LTC Application
        """

        @role_required(Permissions.client)
        def post(self):
            """
            Send post request
            payload:
            form: {
                <Form Data as JSON>
            }
            files: {
                attachments: <Proof upload files>, optional
            }
            """
            analyse()
            user: Users = current_user
            # gets file tagged with name attachments
            file = request.files.get('attachments')
            if file != None:
                filename = file.filename
                if not filemanager.isCorrectFileType(filename, ['.pdf', '.zip']):
                    abort(
                        400, error='Invalid file type. Only .pdf, .zip files are permitted')
                file_encoding = filemanager.encodeFile(file)
                if len(file_encoding) > MAX_UPLOAD_SIZE:
                    abort(
                        413, error=f'File Size should be less than {MAX_UPLOAD_SIZE/(1024*1024)} MB!')
            # get form data
            form_data = json.loads(request.form.get('form'))

            # remove key attachments (which is redudant) from form json
            form_data.pop('attachments')
            # section form fields
            form_data['establishment'] = {}
            last_avalied: LTCRequests = LTCRequests.query.filter(
                LTCRequests.user_id == current_user.id).order_by(desc(LTCRequests.created_on)).first()
            if last_avalied != None:
                last_est_form = last_avalied.form['establishment']
                form_data['establishment'] = {
                    "est_data_nature_last": last_est_form.get("est_data_nature_current", ''),
                    "est_data_period_last_from": (None if last_est_form.get('est_data_period_current_from', None) == None else str(last_est_form.get('est_data_period_current_from'))[:10]),
                    "est_data_period_last_to": (None if last_est_form.get('est_data_period_current_to', None) == None else str(last_est_form.get('est_data_period_current_to'))[:10]),
                    "est_data_last_ltc_for": last_est_form.get('est_data_current_ltc_for', ''),
                    "est_data_last_ltc_days": last_est_form.get('est_data_current_ltc_days', ''),
                    "est_data_last_earned_leave_on": (None if last_est_form.get('est_data_current_earned_leave_on', None) == None else str(last_est_form.get('est_data_current_earned_leave_on'))[:10]),
                    "est_data_last_balance": last_est_form.get("est_data_current_balance", ''),
                    "est_data_last_encashment_adm": last_est_form.get("est_data_current_encashment_adm", ''),
                    "est_data_last_nature": last_est_form.get('est_data_current_nature', ''),
                }
                print(form_data['establishment'])

            form_data['accounts'] = {}
            # add LTC request to table
            new_request: LTCRequests = LTCRequests(user_id=user.id)
            new_request.form = form_data
            # initialise the application
            db.session.add(new_request)
            db.session.commit()

            # get request ID
            db.session.refresh(new_request)
            new_request.forward(current_user)

            if file != None:
                ltc_upload = LTCProofUploads(
                    new_request.request_id, file_encoding, filename)
                db.session.add(ltc_upload)
            db.session.commit()

            # send email to user
            emailmanager.sendEmail(
                current_user,
                f'LTC Request, ID {new_request.request_id} created',
                emailmanager.ltc_req_created_msg % (
                    current_user.name, new_request.request_id)
            )
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)

    class FillStageForm(Resource):
        """
        Fill forms for individual stages(establishment section, accounts section)
        """
        allowed_roles = [
            Permissions.establishment,
            Permissions.accounts,
        ]

        @roles_required(roles=allowed_roles)
        def post(self, permission):
            analyse()

            request_id = request.json['request_id']
            if not request_id:
                abort(404, msg='Request ID not sent')

            content = request.json.get('stage_form', None)
            if not content:
                abort(404, msg='No form content sent!')

            form: LTCRequests = LTCRequests.query.get(int(request_id))

            if not form:
                abort(404, msg="Invalid Request ID")

            form.form[permission] = content
            flag_modified(form, "form")
            db.session.merge(form)
            db.session.commit()
            return jsonify({"msg": "updated!"})

    class CommentOnLTC(Resource):
        """
        Comment on LTC Application and forward it to next stage
        """
        allowed_roles = [
            Permissions.deanfa,
            Permissions.registrar,
            Permissions.establishment,
            Permissions.accounts,
            Permissions.audit,
            Permissions.dept_head
        ]

        @roles_required(roles=allowed_roles)
        def post(self, **kwargs):
            """
            Payload:
            json:{
                request_id: int
                comment: string
                approval: string (action-> approve, review, decline)
            }
            """
            analyse()
            # post request ID, comment, and approval of the user
            request_id = request.json['request_id']
            comment = request.json['comment']
            action = request.json.get('approval')

            if not request_id or not comment or not action:
                abort(404, msg='Incomplete args')

            if not action in ['review', 'approve', 'decline']:
                abort(400, error='Invalid action')

            form: LTCRequests = LTCRequests.query.get(int(request_id))
            if not form:
                abort(404, msg='Form not found')

            user_dept: Departments = Departments.query.get(
                current_user.department)


            applicant: Users = Users.query.get(form.user_id)
            if kwargs['permission'] == Permissions.dept_head:
                form.addDeptComment(current_user, comment,
                                    True if action == 'approve' else False)
            else:
                form.addComment(current_user, comment,
                                True if action == 'approve' else False, is_review=True if action == 'review' else False)
            if action == 'review':  # application to be sent back for review
                form.send_for_review(current_user, applicant, comment)
                db.session.commit()
                return {"status": 'sent for review'}, 200
            else:
                """
                Application is forwarded, or decline only when the stage head forwards or declines it.
                For other users, only a recommendation is taken
                """
                if current_user.id == user_dept.dept_head:
                    if action == 'approve':
                        status, comment = form.forward(applicant)
                        db.session.commit()
                        return {"Status": comment['msg']}, 200
                    elif action == 'decline':
                        form.decline(applicant)
                        form.is_active = False
                        db.session.commit()
                        return {'status': 'declined'}
                else:
                    db.session.commit()
                    return {"status": 'Comment added'}, 200

    class GetLtcFormData(Resource):
        """
        Get LTC form data by request ID
        """
        @check_role()
        def post(self, **kwargs):
            """
            Send POST request to get form
            payload:
            @args: json:{
                request_id: int
            }
            @return: {
                'request_id'
                'email'
                'created_on'
                'stage'
                'is_active'
                'form_data'
                'comments'
            }
            """
            analyse()
            request_id = request.json['request_id']
            if not request_id:
                abort(404, msg='Request ID not sent')
            form: LTCRequests = LTCRequests.query.get(int(request_id))
            if not form:
                abort(404, msg='Form not found')
            user_email = None
            # if current user is client, check if form is theirs
            if kwargs['permission'] == Permissions.client:
                if form.user_id != current_user.id:
                    return abort(403, status={'error': 'Forbidden resource'})
                user_email = current_user.email
            if not user_email:
                user_email = Users.query.get(form.user_id).email
            result = {
                'request_id': form.request_id,
                'email': user_email,
                'created_on': form.created_on,
                'stage': form.stage,
                'is_active': form.is_active,
                'form_data': form.form,
                'comments': form.comments
            }
            response = {'data': result}

            return jsonify(response)

    class GetLtcFormAttachments(Resource):
        """
        Get LTC form attachments by request ID
        """
        @check_role()
        def post(self, permission):
            """
            Send POST request to get form
            payload:
            @args: json:{
                request_id: int
            }
            @return: file object
            """
            analyse()
            request_id = request.json['request_id']
            print(request_id)
            if not request_id:
                abort(404, msg='Request ID not sent')
            form: LTCRequests = LTCRequests.query.get(request_id)
            if not form:
                abort(404, msg='Form not found')
            if permission == Permissions.client:
                if form.user_id != current_user.id:
                    return abort(403, status={'error': 'Forbidden resource'})
            ltc_upload: LTCProofUploads = LTCProofUploads.query.get(request_id)
            if ltc_upload == None:
                return abort(404, status={'error': 'No attachment'})

            return filemanager.sendFile(ltc_upload.file, ltc_upload.filename)

    class GetLtcFormMetaDataForUser(Resource):
        """
        Get LTC form data by user ID
        """
        @role_required(Permissions.client)
        def get(self):
            analyse()

            user: Users = current_user
            forms = LTCRequests.query.filter_by(user_id=user.id)
            results = []

            for form in forms:
                form: LTCRequests
                results.append({
                    'request_id': form.request_id,
                    'created_on': (form.created_on),
                    'stage': form.stage,
                    'is_active': "In Progress" if form.is_active else "Completed",
                })
            response = {'data': results}

            return jsonify(response)

    class GetLtcFormMetaData(Resource):
        """
        Get LTC form metadata from LTC table
        """
        allowed_roles = [
            Permissions.admin,
            Permissions.deanfa,
            Permissions.registrar,
            Permissions.establishment,
            Permissions.accounts,
            Permissions.audit,
            Permissions.dept_head,
        ]

        @roles_required(roles=allowed_roles)
        def get(self, **kwargs):
            analyse()

            user: Users = current_user
            forms = db.session.query(LTCRequests, Users).join(Users).all()
            results = []
            for form, user in forms:
                form: LTCRequests
                user: Users
                results.append({
                    'request_id': form.request_id,
                    'user': user.email,
                    'name': user.name,
                    'user_id': form.user_id,
                    'created_on': form.created_on,
                    'stage': form.stage,
                    'is_active': "In Progress" if form.is_active else "Completed",
                })
            response = {'data': results}

            return jsonify(response)

    class GetPastApprovalRequests(Resource):
        allowed_roles = [
            Permissions.deanfa,
            Permissions.registrar,
            Permissions.establishment,
            Permissions.accounts,
            Permissions.audit,
            Permissions.dept_head
        ]

        @roles_required(roles=allowed_roles)
        def get(self, **kwargs):
            analyse()

            user: Users = current_user
            department = user.department
            if kwargs['permission'] == Permissions.dept_head:
                department = 'department'
            table_ref = Departments.getDeptRequestTableByName(department)

            if not table_ref:
                abort(
                    404, msg={'Error': 'user department not registered as stage dept'})
            previous = []

            past = None
            new = None
            """
            Fetch requests, both with status!=new, and also those on which
            the user has commented already
            """
            if kwargs['permission'] == Permissions.dept_head:
                past = db.session.query(table_ref, LTCRequests, Users).join(Users).join(
                    table_ref).filter(table_ref.status != 'new', table_ref.department == user.department)
                new = db.session.query(table_ref, LTCRequests, Users).join(Users).join(
                    table_ref).filter_by(status='new', department=user.department)
            else:
                past = db.session.query(table_ref, LTCRequests, Users).join(
                    Users).join(table_ref).filter(table_ref.status != 'new')
                new = db.session.query(table_ref, LTCRequests, Users).join(
                    Users).join(table_ref).filter_by(status='new')

            for dept_log, form, applicant in past:
                previous.append({
                    'request_id': form.request_id,
                    'user': applicant.email,
                    'name': applicant.name,
                    'created_on': form.created_on,
                    'stage': form.stage,
                    'is_active': "In Progress" if form.is_active else "Completed",
                })

            for dept_log, form, applicant in new:
                if form.comments.get(department, None) != None:
                    if len(form.comments[department]) == 0:
                        abort(400, 'Not allowed to add comment at this stage')
                    if form.comments[department][-1]['approved'].get(user.email, True) != None:
                        previous.append({
                            'request_id': form.request_id,
                            'user': applicant.email,
                            'name': applicant.name,
                            'created_on': form.created_on,
                            'stage': form.stage,
                            'is_active': "In Progress" if form.is_active else "Completed",
                        })
            return jsonify({'previous': previous})

    class GetEstablishmentReview(Resource):
        @role_required(Permissions.establishment)
        def get(self):
            analyse()

            reviews = db.session.query(LTCRequests, EstablishmentReview, Users).join(
                EstablishmentReview).join(Users).all()
            to_review = []
            for form, review, applicant in reviews:
                to_review.append(
                    {
                        'request_id': form.request_id,
                        'user': applicant.email,
                        'name': applicant.name,
                        'created_on': form.created_on,
                        'received_from': review.received_from,
                        'status': review.status
                    }
                )

            return jsonify({'review': to_review})

    class EditStageForm(Resource):
        @role_required(role=Permissions.establishment)
        def post(self, **kwargs):
            analyse()
            request_id = request.form.get('request_id')
            updated_form = json.loads(request.form.get('form'))
            db_form: LTCRequests = LTCRequests.query.get(request_id)

            db_form.form[Stages.establishment] = updated_form
            flag_modified(db_form, "form")
            db.session.merge(db_form)

            db.session.commit()
            return jsonify({'msg': 'Updated'})

    class ResolveReviewRequest(Resource):
        allowed_roles = [
            Permissions.establishment,
            Permissions.client
        ]

        @roles_required(roles=allowed_roles)
        def post(self, permission):
            analyse()
            if permission == Permissions.establishment:
                return self.resolveEstablishmentReview()
            else:
                return self.resolveClientReview()

        def resolveClientReview(self):
            # get updated form
            request_id = (request.form.get('request_id'))
            updated_form: dict = json.loads(request.form.get('form'))
            print(updated_form)
            updated_file = request.files.get('attachment', None)
            # update attachments if any
            if updated_file != None:
                if not filemanager.isCorrectFileType(updated_file.filename, ['.pdf', '.zip']):
                    abort(
                        400, error='Invalid file type. Only .pdf, .zip files are permitted')
                ltc_upload_enc = filemanager.encodeFile(updated_file)

                if len(ltc_upload_enc) > MAX_UPLOAD_SIZE:
                    abort(
                        413, error=f'File Size should be less than {MAX_UPLOAD_SIZE/(1024*1024)} MB!')
                ltc_upload: LTCProofUploads = LTCProofUploads.query.get(
                    request_id)
                if ltc_upload == None:
                    ltc_upload = LTCProofUploads(request_id, None, None)
                    db.session.add(ltc_upload)
                ltc_upload.filename = updated_file.filename
                ltc_upload.file = ltc_upload_enc

            if updated_form.get('attachments', False) != False:
                updated_form.pop('attachments')
            db_form: LTCRequests = LTCRequests.query.get(request_id)
            print(db_form.form)
            # Take care not to patch department form fields
            restricted_fields = {stage: True for stage in Stages.__dict__}
            for field in updated_form:
                if restricted_fields.get(field, False):
                    continue
                if db_form.form.get(str(field), None) != None:
                    db_form.form[str(field)] = updated_form[field]

            flag_modified(db_form, "form")
            db.session.merge(db_form)

            # TODO: update establishment review table
            est_review_entry: EstablishmentReview = EstablishmentReview.query.get(
                request_id)
            if est_review_entry == None:  # review was sent by establishment
                est_entry: EstablishmentLogs = EstablishmentLogs.query.get(
                    request_id)
                est_entry.status = ApplicationStatus.new
                db_form.stage = Stages.establishment
            else:  # review was sent through establishment, i.e was sent by some other stage originally
                status = (str(EstablishmentReview.Status.reviewed_by_user))
                est_review_entry.status = status
                received_from = str(est_review_entry.received_from)
                print(received_from)
                db_form.stage = received_from
            db.session.commit()
            return jsonify({'msg': 'Updated'})

        def resolveEstablishmentReview(self):
            # fetch updated establishment section form fields
            request_id = request.json.get('request_id')
            comment = (request.json.get('comment'))
            action = (request.json.get('action'))
            print('action', action)
            print('comment', comment)
            print('req', request_id)
            db_form: LTCRequests = LTCRequests.query.get(request_id)
            applicant: Users = Users.query.get(db_form.request_id)

            est_review: EstablishmentReview = EstablishmentReview.query.get(
                request_id)
            if action == 'send_to_user':
                db_form.send_for_review(current_user, applicant, comment)
                est_review.status = est_review.Status.sent_to_user
                db_form.addComment(current_user, comment, False, True)
            elif action == 'resolve':
                # add comment
                # mark the application as new in the sender's table
                db_form.removeLastComment(Stages.establishment)
                db_form.addComment(current_user, comment, True, True)
                sender_table_ref = Departments.getDeptRequestTableByName(
                    est_review.received_from)
                print(sender_table_ref)
                sender_row_ref = sender_table_ref.query.get(request_id)
                sender_row_ref.status = 'new'
                db.session.delete(est_review)

            db.session.commit()
            return jsonify({'msg': 'Updated'})

    class GetPendingApprovalRequests(Resource):
        allowed_roles = [
            Permissions.deanfa,
            Permissions.registrar,
            Permissions.establishment,
            Permissions.accounts,
            Permissions.audit,
            Permissions.dept_head
        ]

        @roles_required(roles=allowed_roles)
        def get(self, **kwargs):
            analyse()
            user: Users = current_user
            department = user.department
            if kwargs['permission'] == Permissions.dept_head:
                department = 'department'
            table_ref = Departments.getDeptRequestTableByName(department)

            if not table_ref:
                abort(
                    404, msg={'Error': 'user department not registered as stage dept'})
            new = None
            if kwargs['permission'] == Permissions.dept_head:
                print(table_ref)
                new = db.session.query(table_ref, LTCRequests, Users).join(Users).join(
                    table_ref).filter(table_ref.status == 'new', Users.department == user.department)
            else:
                new = db.session.query(table_ref, LTCRequests, Users).join(
                    Users).join(table_ref).filter(table_ref.status == 'new')
            pending = []

            for dept_log, form, applicant in new:
                if form.comments.get(department, None) != None:
                    if len(form.comments[department]) == 0:
                        abort(400, 'Not allowed to add comment at this stage')
                    if form.comments[department][-1]['approved'].get(user.email, True) == None:
                        print(dept_log.status)
                        pending.append({
                            'request_id': form.request_id,
                            'user': applicant.email,
                            'name': applicant.name,
                            'created_on': form.created_on,
                            'stage': form.stage,
                            'is_active': "In Progress" if form.is_active else "Completed",
                        })

            return jsonify({'pending': pending})

    class UploadOfficeOrder(Resource):
        @role_required(role='establishment')
        def post(self, **kwargs):
            analyse()
            print(request.headers)
            file = request.files.get('office_order', None)

            if file == None:
                abort(400, error='File not uploaded!')

            request_id = int(request.form.get('request_id'))
            form: LTCRequests = LTCRequests.query.get(request_id)
            approved_entry: LTCApproved = LTCApproved.query.get(request_id)
            user: Users = Users.query.get(form.user_id)
            if not approved_entry:
                abort(400, error='Form not yet approved')

            filename = file.filename
            if not filemanager.isCorrectFileType(filename, ['.pdf', '.zip']):
                abort(
                    400, error='Invalid file type. Only .pdf, .zip files are permitted')
            office_order_enc = filemanager.encodeFile(file)
            if len(office_order_enc) > MAX_UPLOAD_SIZE:
                abort(
                    413, error=f'File Size should be less than {MAX_UPLOAD_SIZE/(1024*1024)} MB!')

            advance_required = False
            # check if advance required!
            if form.form['adv_is_required'] == 'Yes':
                advance_required = True

            if advance_required:
                form.stage = Stages.advance_pending
                # send to accounts for advance payment
                advance_req: AdvanceRequests = AdvanceRequests(
                    request_id=request_id)
                db.session.add(advance_req)
                user.addNotification(
                    f'Officer order for LTC ID {form.request_id} has been generated. Advance Payment request sent to accounts section')
                acc_roles = get_stage_roles(Stages.accounts)
                for acc_user in acc_roles:
                    acc_user.addNotification(
                        f'LTC ID {request_id} sent for advance payment')
            else:
                form.stage = Stages.approved
                form.is_active = False
                user.addNotification(
                    f'Officer order for LTC ID {form.request_id} has been generated.')
                approved_entry.approved_on = datetime.now()

            office_order_upload_entry: LTCOfficeOrders = LTCOfficeOrders(
                request_id, office_order_enc, filename)
            approved_entry.office_order_created = True
            db.session.add(office_order_upload_entry)
            db.session.commit()

            # deanfa, hod, dr accounts,
            dean_stage_user: StageUsers = StageUsers.query.filter(
                StageUsers.designation == StageUsers.Designations.deanfa).one_or_none()
            dean: Users = Users.query.get(dean_stage_user.user_id)
            user_dept: Departments = Departments.query.get(user.department)
            hod: Users = Users.query.get(user_dept.dept_head)

            emailmanager.sendMailWithCC([user], [dean, hod],
                                        f'Office order generated for LTC Request ID {form.request_id}',
                                        emailmanager.ltc_office_order_msg % (
                user.name, request_id), attachment=(filename, office_order_enc)
            )

            return jsonify({'success': 'Office Order Uploaded!'})

    class GetPendingOfficeOrderRequests(Resource):
        @role_required(role=Permissions.establishment)
        def get(self):
            analyse()
            pending = db.session.query(LTCApproved, LTCRequests, Users).join(Users).join(
                LTCApproved).filter(LTCApproved.office_order_created == False)
            result = []
            for pending_appl, form, applicant in pending:
                result.append({
                    'request_id': pending_appl.request_id,
                    'user': applicant.email,
                    'name': applicant.name,
                    'approved_on': pending_appl.approved_on,
                })
            return jsonify({'pending': result})

    class GetOfficeOrder(Resource):
        """
        Fetch LTC office order by request ID
        """
        @check_role()
        def post(self, permission):
            analyse()
            request_id = request.json['request_id']
            print(request_id)
            if not request_id:
                abort(404, msg='Request ID not sent')
            approved_form: LTCApproved = LTCApproved.query.get(request_id)
            if not approved_form:
                abort(404, msg='Form not yet approved!')
            form: LTCRequests = LTCRequests.query.get(request_id)
            if permission == Permissions.client:
                if form.user_id != current_user.id:
                    return abort(403, status={'error': 'Forbidden resource'})
            office_order: LTCOfficeOrders = LTCOfficeOrders.query.get(
                request_id)
            if office_order == None:
                return abort(404, status={'error': 'Office order not yet generated'})
            return filemanager.sendFile(office_order.file, office_order.filename)

    class GetPendingAdvancePaymentRequests(Resource):
        """
        Fetch pending advance payment request by ID
        """
        @role_required(role=Permissions.accounts)
        def get(self):
            analyse()
            pending = db.session.query(AdvanceRequests, LTCRequests, Users).join(Users).join(
                AdvanceRequests).filter(AdvanceRequests.status == AdvanceRequests.Status.new)
            result = []
            for adv_req, ltc_req, applicant in pending:
                result.append({
                    'request_id': ltc_req.request_id,
                    'user': applicant.email,
                    'name': applicant.name,
                    'created_on': adv_req.created_on,
                })
            return jsonify({'pending': result})

    class UpdateAdvancePaymentDetails(Resource):
        """
        Update advance payemnt details
        """
        @role_required(role=Permissions.accounts)
        def post(self):
            analyse()
            request_id = (request.form.get('request_id', None))
            request_id = int(request_id)
            amount = request.form.get('amount', None)
            comments = request.form.get('comments', None)
            payment_proof = request.files.get('payment_proof', None)
            print(amount)
            if None in [request_id, amount, comments, payment_proof]:
                abort(400)
            adv_req: AdvanceRequests = AdvanceRequests.query.filter_by(
                request_id=request_id).first()
            adv_req.payment(amount, comments)

            adv_req.payment_proof_filename = payment_proof.filename
            if not filemanager.isCorrectFileType(adv_req.payment_proof_filename, ['.pdf', '.zip']):
                abort(
                    400, error='Invalid file type. Only .pdf, .zip files are permitted')
            adv_req.payment_proof = filemanager.encodeFile(payment_proof)

            form: LTCRequests = LTCRequests.query.get(request_id)
            form.stage = Stages.approved
            form.is_active = False
            applicant: Users = Users.query.get(form.user_id)
            applicant.addNotification(
                f'Advance Payment of ₹{amount} for LTC ID {request_id} issued. Check email for more info')
            emailmanager.sendMailWithCC([applicant], [],
                                        f'Advance Payment for LTC ID {request_id} issued',
                                        f"""Hello {applicant.name}
Advance payment of amount ₹{amount} has been issued for your LTC Application ID {request_id}. 
PFA document for payment information.
            """, (adv_req.payment_proof_filename, adv_req.payment_proof)
            )
            db.session.commit()
            return jsonify({"success": "uploaded proofs"})

    class PrintForm(Resource):
        @check_role()
        def post(self, permission):
            analyse()
            request_id = (request.json.get('request_id', None))
            if request_id == None:
                abort(400, error='Invalid request ID')
            request_id = int(request_id)
            form_data: LTCRequests = LTCRequests.query.get(request_id)
            applicant: Users = Users.query.get(form_data.user_id)

            if permission == Permissions.client:
                if applicant.id != current_user.id:
                    abort(400, error='unauthorised')

            response = {}
            response['form'] = form_data.form
            response['comments'] = form_data.comments
            response['signatures'] = {}
            response['signatures']['user'] = applicant.signature

            # signatures
            if form_data.stage in [Stages.approved, Stages.advance_pending]:
                department = db.session.query(Departments, Users).filter(
                    Departments.name == applicant.department, Departments.dept_head == Users.id).one_or_none()
                if department != None:
                    dept, dept_head = department
                    response['signatures']['section_head'] = dept_head.signature
                stages = [
                    (Stages.establishment, Permissions.establishment),
                    (Stages.audit, Permissions.audit),
                    (Stages.accounts, Permissions.accounts),
                    (Stages.registrar, Permissions.registrar),
                    (Stages.deanfa, Permissions.deanfa),
                ]

                for stage, permission in stages:
                    query = db.session.query(Users, StageUsers).join(
                        StageUsers).filter(Users.permission == permission)
                    signatures = {}
                    approvals = form_data.getLatestCommentForStage(stage)
                    for user, stage_user in query:
                        print(user.email)
                        if approvals[user.email] == True:
                            file = user.signature
                        else:
                            file = None
                        # file = user.signature
                        signatures[stage_user.designation] = file

                    response['signatures'][stage] = signatures

            return {'data': response}

    class PrintOfficeOrder(Resource):
        """
        Print office order
        """
        @role_required(role=Permissions.establishment)
        def post(self):
            analyse()
            request_id = (request.json.get('request_id', None))
            if request_id == None:
                abort(400, error='Invalid request ID')
            request_id = int(request_id)
            form_data: LTCRequests = LTCRequests.query.get(request_id)
            applicant: Users = Users.query.get(form_data.user_id)

            response = {}
            response['form_data'] = form_data.form
            response['comments'] = form_data.comments
            response['signatures'] = {}
            response['signatures']['user'] = applicant.signature

            # add department section signature

            department = db.session.query(Departments, Users).filter(
                Departments.name == applicant.department, Departments.dept_head == Users.id).one_or_none()
            if department != None:
                dept, dept_head = department
                response['signatures']['section_head'] = dept_head.signature
            stages = [
                (Stages.establishment, Permissions.establishment),
                (Stages.audit, Permissions.audit),
                (Stages.accounts, Permissions.accounts),
                (Stages.registrar, Permissions.registrar),
                (Stages.deanfa, Permissions.deanfa),
            ]

            # add signatures

            for stage, permission in stages:
                query = db.session.query(Users, StageUsers).join(
                    StageUsers).filter(Users.permission == permission)
                signatures = {}
                approvals = form_data.getLatestCommentForStage(stage)
                for user, stage_user in query:
                    file = user.signature
                    signatures[stage_user.designation] = file

                response['signatures'][stage] = signatures

            return {'data': response}
