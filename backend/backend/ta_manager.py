import json
from . import db
from . import filemanager
from . import emailmanager
from .analyse import analyse
from datetime import datetime
from flask_jwt_extended import current_user
from flask import jsonify, request, make_response
from sqlalchemy.orm.attributes import flag_modified
from flask_restful import Resource, abort, fields
from .models import AccountsTAPayments, StageUsers, Stages, TAProofUploads
from .role_manager import Permissions, role_required, roles_required, check_role
from .models import ApplicationStatus,  LTCApproved,\
    Users, LTCRequests, Departments, TAApproved, TARequests, TAOfficeOrders, \
    EstablishmentTALogs, AccountsTALogs, AuditTALogs, get_stage_roles


class TaManager():
    class ApplyForTA(Resource):
        """
        API for filling TA form
        """
        @role_required(role=Permissions.client)
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
            # get form data
            form_data = json.loads(request.form.get('form'))
            ltc_request_id = request.form.get('ltc_id')

            if not ltc_request_id:
                abort(400, error='LTC ID not sent🤭')

            ltc_application: LTCRequests = LTCRequests.query.get(
                int(ltc_request_id))
            if not ltc_application:
                abort(404, error='LTC Application not found😔')
            if user.id != ltc_application.user_id:
                abort(400, error='Not your LTC Application😡')
            ltc_approved_entry: LTCApproved = LTCApproved.query.get(
                int(ltc_request_id))
            if not ltc_approved_entry:
                abort(400, error='LTC Application not yet approved!😶')

            print(form_data)
            # remove key attachments (which is redudant) from form json
            form_data.pop('attachments')
            # section form fields
            form_data['accounts'] = {}
            # add TA request to table
            new_request: TARequests = TARequests(
                user.id, ltc_application.request_id)
            new_request.form = form_data
            # initialise the application
            db.session.add(new_request)
            db.session.commit()

            # get request ID
            db.session.refresh(new_request)
            new_request.forward(current_user)

            if file != None:
                filename = file.filename
                file_encoding = filemanager.encodeFile(file)
                ltc_upload = TAProofUploads(
                    new_request.request_id, file_encoding, filename)
                db.session.add(ltc_upload)
            db.session.commit()

            emailmanager.sendEmail(
                current_user,
                f'TA Request, ID {new_request.request_id} created for LTC ID ',
                emailmanager.ta_req_created_msg % (
                    current_user.name, new_request.request_id, new_request.ltc_id)
            )
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)

    class GetTaFormData(Resource):
        """
        Get TA form data by request ID
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
            form: TARequests = TARequests.query.get(int(request_id))
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

    class GetApprovedLTCForTA(Resource):
        """
        API for fetching approved LTC applications eligible for TA
        """
        @role_required(role=Permissions.client)
        def get(self):
            analyse()
            user: Users = current_user
            forms = db.session.query(LTCRequests, LTCApproved).join(LTCApproved).filter(
                LTCRequests.user_id == user.id, LTCApproved.office_order_created == True)
            print(forms)
            results = []
            for form, approved_form in forms:
                results.append({
                    'request_id': form.request_id,
                    'approved_on': approved_form.approved_on,
                })
            response = {'data': results}

            return jsonify(response)

    class GetPendingTaPaymentRequests(Resource):
        @role_required(role=Permissions.accounts)
        def get(self):
            analyse()
            pending = db.session.query(AccountsTAPayments, TARequests, Users).join(Users).join(
                AccountsTAPayments).filter(AccountsTAPayments.status == AccountsTAPayments.Status.pending)
            result = []
            for pay_req, ta_form, applicant in pending:
                result.append({
                    'request_id': ta_form.request_id,
                    'ltc_id': ta_form.ltc_id,
                    'user': applicant.email,
                    'name': applicant.name,
                    'created_on': ta_form.created_on,
                })
            return jsonify({'pending': result})

    class GetTaFormAttachments(Resource):
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
            form: TARequests = TARequests.query.get(request_id)
            if not form:
                abort(404, msg='Form not found')
            if permission == Permissions.client:
                if form.user_id != current_user.id:
                    return abort(403, status={'error': 'Forbidden resource'})
            ta_upload: TAProofUploads = TAProofUploads.query.get(request_id)
            if ta_upload == None:
                return abort(404, status={'error': 'No attachment'})

            return filemanager.sendFile(ta_upload.file, ta_upload.filename)

    class GetTaFormMetaDataForUser(Resource):
        """
        Get TA form data by user ID
        """
        @role_required(Permissions.client)
        def get(self):
            analyse()
            user: Users = current_user
            forms = TARequests.query.filter_by(user_id=user.id)
            results = []
            for ta_form in forms:
                results.append({
                    'request_id': ta_form.request_id,
                    'ltc_id': ta_form.ltc_id,
                    'created_on': (ta_form.created_on),
                    'stage': ta_form.stage,
                    'is_active': "Active" if ta_form.is_active else "Not Active",
                })
            response = {'data': results}

            return jsonify(response)

    class GetTaFormMetaData(Resource):
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
            # forms = db.session.query(LTCRequests, LTCApproved, TARequests, Users).join(LTCRequests).join(TARequests).join(Users).all()
            forms = db.session.query(TARequests, LTCApproved, Users).join(
                LTCApproved).join(Users).all()
            results = []
            for form, ltc_appr, user in forms:
                results.append({
                    'request_id': form.request_id,
                    'ltc_id': ltc_appr.request_id,
                    'user': user.email,
                    'name': user.name,
                    'created_on': form.created_on,
                    'stage': form.stage,
                    'is_active': "In Progress" if form.is_active else "Completed",
                })
            response = {'data': results}

            return jsonify(response)

    class CommentOnTA(Resource):
        """
        API for commenting and forwarding TA form
        """
        roles = [
            Permissions.establishment,
            Permissions.audit,
            Permissions.accounts,
            Permissions.registrar,
            Permissions.dept_head
        ]

        @roles_required(roles=roles)
        def post(self, **kwargs):
            """
            Payload:
            json:{
                request_id: int
                comment: string
                approval: string (action-> approve, decline)
            }
            """
            analyse()
            # post request ID, comment, and approval of the user
            request_id = request.json['request_id']
            comment = request.json['comment']
            action = str(request.json.get('approval')
                         ).strip().lower()  # recommend, decline

            if not request_id or not comment or not action:
                abort(404, msg='Incomplete args')

            if not action in ['review', 'approve', 'decline']:
                abort(400, error='Invalid action')

            form: TARequests = TARequests.query.get(int(request_id))
            if not form:
                abort(404, msg='Form not found')

            user_dept: Departments = Departments.query.get(
                current_user.department)
            # if not user_dept.is_stage:
            #     abort(401, msg='Only stage users allowed')

            applicant: Users = Users.query.get(form.user_id)
            if kwargs['permission'] == Permissions.dept_head:
                form.addDeptComment(current_user, comment,
                                    True if action == 'approve' else False)
            else:
                form.addComment(current_user, comment,
                                True if action == 'approve' else False)

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
                    db.session.commit()
                    return {'status': 'declined'}
            else:
                db.session.commit()
                return {"status": 'Comment added'}, 200

    class FillTaStageForm(Resource):
        """
        Fill forms for individual stages(establishment section, accounts section)
        """
        allowed_roles = [
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

            form: TARequests = TARequests.query.get(int(request_id))

            if not form:
                abort(404, msg="Invalid Request ID")

            form.form[permission] = content
            flag_modified(form, "form")
            db.session.merge(form)
            db.session.commit()
            return jsonify({"msg": "updated!"})

    class GetPendingTaApprovalRequests(Resource):
        """
        Fetch pending TA approval requests
        """
        allowed_roles = [
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
            table_ref = Departments.getDeptRequestTableByName(department+'_ta')

            if not table_ref:
                abort(
                    404, msg={'Error': 'user department not registered as stage dept'})
            new = None
            if kwargs['permission'] == Permissions.dept_head:
                new = db.session.query(table_ref, TARequests, Users).join(Users).join(
                    table_ref).filter(table_ref.status == 'new', Users.department == user.department)
            else:
                new = db.session.query(table_ref, TARequests, Users).join(
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
                            'ltc_id': form.ltc_id,
                            'user': applicant.email,
                            'name': applicant.name,
                            'created_on': form.created_on,
                            'stage': form.stage,
                            'is_active': "In Progress" if form.is_active else "Completed",
                        })

            return jsonify({'pending': pending})

    class GetTaOfficeOrder(Resource):
        @check_role()
        def post(self, permission):
            analyse()
            request_id = request.json['request_id']
            print(request_id)
            if not request_id:
                abort(404, msg='Request ID not sent')
            approved_form: TAApproved = TAApproved.query.get(request_id)
            if not approved_form:
                abort(404, msg='Form not yet approved!')
            form: TARequests = TARequests.query.get(request_id)
            if permission == Permissions.client:
                if form.user_id != current_user.id:
                    return abort(403, status={'error': 'Forbidden resource'})
            office_order: TAOfficeOrders = TAOfficeOrders.query.get(
                request_id)
            if office_order == None:
                return abort(404, status={'error': 'Office order not yet generated'})
            return filemanager.sendFile(office_order.file, office_order.filename)

    class UploadTaOfficeOrder(Resource):
        """
        API for uploading TA office order
        """
        @role_required(role=Permissions.establishment)
        def post(self, **kwargs):
            analyse()
            print(request.headers)
            file = request.files.get('office_order', None)

            if file == None:
                abort(400, error='File not uploaded!')

            request_id = int(request.form.get('request_id'))
            form: TARequests = TARequests.query.get(request_id)
            approved_entry: TAApproved = TAApproved.query.get(request_id)
            user: Users = Users.query.get(form.user_id)
            if not approved_entry:
                abort(400, error='Form not yet approved')

            filename = file.filename
            office_order_enc = filemanager.encodeFile(file)

            form.stage = TARequests.Stages.payment_pending
            approved_entry.approved_on = datetime.now()

            office_order_upload_entry: TAOfficeOrders = TAOfficeOrders(
                request_id, office_order_enc, filename)
            approved_entry.office_order_created = True
            db.session.add(office_order_upload_entry)
            payment_request: AccountsTAPayments = AccountsTAPayments(
                form.request_id)
            db.session.add(payment_request)
            db.session.commit()
            acc_roles = get_stage_roles(TARequests.Stages.accounts)
            for acc_user in acc_roles:
                acc_user.addNotification(
                    f'TA ID {request_id} sent for reimbursement')

            # deanfa, hod, dr accounts,
            dean_stage_user: StageUsers = StageUsers.query.filter(
                StageUsers.designation == StageUsers.Designations.deanfa).one_or_none()
            dean: Users = Users.query.get(dean_stage_user.user_id)
            user_dept: Departments = Departments.query.get(user.department)
            hod: Users = Users.query.get(user_dept.dept_head)

            emailmanager.sendMailWithCC([user], [dean, hod],
                                        f'Office order generated for TA Request ID {form.request_id}',
                                        emailmanager.ta_office_order_msg % (
                user.name, request_id), attachment=(filename, office_order_enc)
            )

            return jsonify({'success': 'Office Order Uploaded!'})

    class GetPendingTaOfficeOrderRequests(Resource):
        """
        Fetch pending TA office order requests
        """
        @role_required(role=Permissions.establishment)
        def get(self):
            analyse()
            pending = db.session.query(TAApproved, TARequests, Users).join(Users).join(
                TAApproved).filter(TAApproved.office_order_created == False)
            result = []
            for pending_appl, form, applicant in pending:
                result.append({
                    'request_id': pending_appl.request_id,
                    'user': applicant.email,
                    'name': applicant.name,
                    'approved_on': pending_appl.approved_on,
                })
            return jsonify({'pending': result})

    class GetPastTaApprovalRequests(Resource):
        """
        Get TA applications approved in the past by stage
        """
        allowed_roles = [
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
            table_ref = Departments.getDeptRequestTableByName(department+'_ta')

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
                past = db.session.query(table_ref, TARequests, Users).join(Users).join(
                    table_ref).filter(table_ref.status != 'new', table_ref.department == user.department)
                new = db.session.query(table_ref, TARequests, Users).join(Users).join(
                    table_ref).filter_by(status='new', department=user.department)
            else:
                past = db.session.query(table_ref, TARequests, Users).join(
                    Users).join(table_ref).filter(table_ref.status != 'new')
                new = db.session.query(table_ref, TARequests, Users).join(
                    Users).join(table_ref).filter_by(status='new')

            for dept_log, form, applicant in past:
                previous.append({
                    'request_id': form.request_id,
                    'ltc_id': form.ltc_id,
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
                            'ltc_id': form.ltc_id,
                            'user': applicant.email,
                            'name': applicant.name,
                            'created_on': form.created_on,
                            'stage': form.stage,
                            'is_active': "In Progress" if form.is_active else "Completed",
                        })
            print(previous)
            return jsonify({'previous': previous})

    class UpdateAccountsPaymentDetails(Resource):
        """
        Update payment details
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
            ta_request: TARequests = TARequests.query.get(request_id)
            payment_req: AccountsTAPayments = AccountsTAPayments.query.get(
                ta_request.request_id)
            payment_req.payment(amount, comments)

            payment_req.payment_proof_filename = payment_proof.filename
            payment_req.payment_proof = filemanager.encodeFile(payment_proof)

            form: TARequests = TARequests.query.get(request_id)
            form.stage = TARequests.Stages.availed
            applicant: Users = Users.query.get(ta_request.user_id)
            applicant.addNotification(
                f'Reimbursement of ₹{amount} for TA ID {request_id} made. Check email for more info')
            emailmanager.sendMailWithCC([applicant], [],
                                        f'Reimbursement for TA ID {request_id} issued',
                                        f"""Hello {applicant.name}
Reimbursement for your TA Application ID {request_id} corresponding to LTC ID {ta_request.ltc_id} has been issued. 
PFA document for payment information.
            """, (payment_req.payment_proof_filename, payment_req.payment_proof)
            )
            db.session.commit()
            return jsonify({"success": "uploaded proofs"})

    class PrintTaForm(Resource):
        """
        Print TA form
        """
        @check_role()
        def post(self, permission):
            analyse()
            request_id = (request.json.get('request_id', None))
            if request_id == None:
                abort(400, error='Invalid request ID')
            request_id = int(request_id)
            form_data: TARequests = TARequests.query.get(request_id)
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
            if form_data.stage in [TARequests.Stages.availed, TARequests.Stages.payment_pending]:
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
                ]

                for stage, permission in stages:
                    query = db.session.query(Users, StageUsers).join(
                        StageUsers).filter(Users.permission == permission)
                    signatures = {}
                    approvals = form_data.getLatestCommentForStage(stage)
                    for user, stage_user in query:
                        if approvals[user.email] == True:
                            file = user.signature
                        else:
                            file = None
                        # file = user.signature
                        signatures[stage_user.designation] = file

                    response['signatures'][stage] = signatures

            return {'data': response}
