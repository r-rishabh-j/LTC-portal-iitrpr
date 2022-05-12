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
from .models import StageUsers, Stages, TAProofUploads
from .role_manager import Permissions, role_required, roles_required, check_role
from .models import ApplicationStatus,  LTCApproved,\
    Users, LTCRequests, Departments, TAApproved, TARequests, TAOfficeOrders, \
    EstablishmentTALogs, AccountsTALogs, AuditTALogs


class TaManager():
    class ApplyForTA(Resource):
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
            form_data['establishment'] = {}
            form_data['accounts'] = {}
            # add LTC request to table
            new_request: TARequests = TARequests(user.id)
            new_request.form = form_data
            # initialise the application
            db.session.add(new_request)
            db.session.commit()

            # get request ID
            db.session.refresh(new_request)
            new_request.forward(current_user, ltc_application.request_id)

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
                emailmanager.ltc_req_created_msg % (
                    current_user.name, new_request.request_id)
            )
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)
