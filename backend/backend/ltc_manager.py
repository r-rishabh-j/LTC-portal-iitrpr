# from email.mime import application
from math import perm
import os
import json
from . import db
from . import filemanager
from .models import StageUsers, Stages
from .analyse import analyse
from markupsafe import escape
from datetime import datetime
from flask_jwt_extended import current_user
from flask import jsonify, request, make_response
from sqlalchemy.orm.attributes import flag_modified
from flask_restful import Resource, abort, fields
from .role_manager import Permissions, role_required, roles_required, check_role
from .models import ApplicationStatus, EstablishmentLogs, EstablishmentReview, LTCApproved,\
    Users, LTCRequests, Departments, AdvanceRequests
from . import emailmanager


class LtcManager:
    class ApplyForLTC(Resource):
        """
        Puts the request in LTCRequests, DepartmentLogs and Establishment Logs
        """

        def initialiseApplication(self, new_request: LTCRequests, current_user: Users):
            """
            Initialise a new application.
            """
            db.session.add(new_request)
            db.session.commit()
            db.session.refresh(new_request)
            new_request.forward(current_user)

        @role_required('client')
        def post(self):
            analyse()
            # gets file tagged with name attachments
            user: Users = current_user
            file = request.files.get('attachments')
            # get form data
            form_data = json.loads(request.form.get('form'))
            filepath = None
            # save file at filepath
            if file != None:
                filepath = filemanager.saveFile(file, user.id)
            print(form_data)
            # remove key attachments (which is redudant) from form json
            form_data.pop('attachments')
            form_data['establishment'] = {}
            form_data['accounts'] = {}
            # add LTC request to table
            new_request: LTCRequests = LTCRequests(user_id=user.id)
            new_request.form, new_request.attachments = form_data, filepath
            # initialise the application
            self.initialiseApplication(new_request, user)
            emailmanager.sendEmail(
                current_user,
                f'LTC Request, ID {new_request.request_id} created',
                emailmanager.ltc_req_created_msg % (
                    current_user.name, new_request.request_id)
            )
            db.session.commit()
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)

    class FillStageForm(Resource):
        """
        Fill forms for individual stages
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
        allowed_roles = [
            Permissions.deanfa,
            Permissions.registrar,
            Permissions.establishment,
            Permissions.accounts,
            Permissions.audit,
        ]

        @roles_required(roles=allowed_roles)
        def post(self, **kwargs):
            analyse()

            # post request ID, comment, and approval of the user
            request_id = request.json['request_id']
            comment = request.json['comment']
            print(comment)
            action = request.json.get('approval')
            print(action)

            if not request_id or not comment or not action:
                abort(404, msg='Incomplete args')

            if not action in ['review', 'approve', 'decline']:
                abort(400, error='Invalid action')

            form: LTCRequests = LTCRequests.query.get(int(request_id))
            if not form:
                abort(404, msg='Form not found')

            user_dept: Departments = Departments.query.get(
                current_user.department)
            if not user_dept.is_stage:
                abort(401, msg='Only stage users allowed')

            applicant: Users = Users.query.get(form.user_id)
            form.addComment(current_user, comment,
                            True if action == 'approve' else False, is_review=True if action == 'review' else False)
            if action == 'review':
                form.send_for_review(current_user, applicant, comment)
                db.session.commit()
                return {"status": 'sent for review'}, 200
            else:
                if current_user.id == user_dept.dept_head:
                    if action == 'approve':
                        status, comment = form.forward(applicant)
                        db.session.commit()
                        return {"Status": comment['msg']}, 200
                    elif action == 'decline':
                        form.decline(applicant)
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
            analyse()

            request_id = request.json['request_id']
            if not request_id:
                abort(404, msg='Request ID not sent')
            form: LTCRequests = LTCRequests.query.get(int(request_id))
            if not form:
                abort(404, msg='Form not found')
            user_email = None
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
            attachment_path = form.attachments
            if not attachment_path or attachment_path == "":
                return abort(404, status={'error': 'No attachment'})
            _, ext = os.path.splitext(attachment_path)
            filename = f'ltc_{request_id}_proofs'+ext
            return filemanager.sendFile(attachment_path, filename)

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
                    'is_active': "Active" if form.is_active else "Not Active",
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
                    'is_active': "Active" if form.is_active else "Not Active",
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
                    'is_active': "Active" if form.is_active else "Not Active",
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
                            'is_active': "Active" if form.is_active else "Not Active",
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
            request_id = request.form.get('request_id')
            print(request_id)
            if permission == Permissions.establishment:
                return self.resolveEstablishmentReview(request_id,)
            else:
                return self.resolveClientReview(request_id,)

        def resolveClientReview(self, request_id):
            # get updated form
            updated_form: dict = json.loads(request.form.get('form'))
            print(updated_form)
            updated_file = request.files.get('attachment', None)
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

            # update attachments if any
            if updated_file != None:
                filepath = filemanager.saveFile(updated_file, db_form.user_id)
                db_form.attachments = filepath

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
                est_review_entry.status = EstablishmentReview.Status.reviewed_by_user
                db_form.stage = EstablishmentReview.received_from
            db.session.commit()
            return jsonify({'msg': 'Updated'})

        def resolveEstablishmentReview(self, request_id):
            # fetch updated establishment section form fields
            # updated_form = json.loads(request.form.get('form'))
            comment = json.loads(request.form.get('comments'))
            action = json.loads(request.form.get('action'))
            db_form: LTCRequests = LTCRequests.query.get(request_id)
            applicant: Users = Users.query.get(db_form.id)

            if action == 'send_to_user':
                db_form.send_for_review(current_user, applicant, comment)
                db_form.addComment(current_user, comment, False, True)
            elif action == 'resolve':
                # add comment
                # mark the application as new in the sender's table
                db_form.removeLastComment(Stages.establishment)
                db_form.addComment(current_user, comment, True, True)
                est_review: EstablishmentReview = EstablishmentReview.query.get(
                    request_id)
                sender_table_ref = Departments.getDeptRequestTableByName(
                    est_review.received_from)
                sender_table_ref.status = 'new'
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
                            'is_active': "Active" if form.is_active else "Not Active",
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
            path = filemanager.saveFile(file, user.id)
            print(path)

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
            else:
                form.stage = Stages.approved
                approved_entry.approved_on = datetime.now()
            approved_entry.office_order = path

            emailmanager.sendEmail(user,
                                   f'Office order generated for LTC Request ID {form.request_id}',
                                   emailmanager.ltc_office_order_msg % (
                                       user.name, request_id)
                                   )

            db.session.commit()
            return jsonify({'success': 'Office Order Uploaded!'})

    class GetPendingOfficeOrderRequests(Resource):
        @role_required(role=Permissions.establishment)
        def get(self):
            analyse()
            pending = db.session.query(LTCApproved, LTCRequests, Users).join(Users).join(
                LTCApproved).filter(LTCApproved.office_order == None)
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
            attachment_path = approved_form.office_order
            if attachment_path == None or attachment_path == "":
                return abort(404, status={'error': 'Office order not yet generated'})
            _, ext = os.path.splitext(attachment_path)
            filename = f'ltc_{request_id}_office_order'+ext
            return filemanager.sendFile(attachment_path, filename)

    class GetPendingAdvancePaymentRequests(Resource):
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
            adv_req.payment_docs(current_user, payment_proof)

            app_form: LTCApproved = LTCApproved.query.get(request_id)
            form: LTCRequests = LTCRequests.query.get(request_id)
            form.stage = Stages.approved
            db.session.commit()
            return jsonify({"success": "uploaded proofs"})

    class PrintForm(Resource):
        @check_role()
        def get(self, permission):
            analyse()
            request_id = (request.form.get('request_id', None))
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

            response['signatures']['user'] = None if applicant.signature == None else filemanager.sendFileAsBlob(
                applicant.signature)
            # signatures
            if form_data.stage in [Stages.approved, Stages.advance_pending, Stages.availed]:
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
                    signatures = []

                    for user, stage_user in query:
                        file = None if user.signature == None else filemanager.sendFileAsBlob(
                            user.signature)
                        signatures.append({
                            stage_user.designation: file
                        })
                    response['signatures'][stage] = signatures

            return {'data': response}
