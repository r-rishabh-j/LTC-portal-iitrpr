import json
import os
from . import db
from . import filemanager
from flask import jsonify, request, make_response, redirect, send_from_directory, send_file
from flask_restful import Resource, reqparse, abort, fields
from .models import Stages, Users, LTCRequests, DepartmentLogs, EstablishmentLogs, Departments
from flask_jwt_extended import current_user
from .role_manager import role_required, roles_required, check_role


class ApplyForLTC(Resource):

    def initialiseApplication(self, new_request: LTCRequests):
        stage = Stages.firstStage()
        new_request.stage = stage['id']
        new_request.comments = {}

        # notify first stage
        department = stage['department']
        first_stage_users = Users.query.filter_by(department=department)
        dept_comments = {
            'approved': {},
            'comments': {},
        }
        for user in first_stage_users:
            dept_comments['approved'][user.email] = None
            dept_comments['comments'][user.email] = None

        new_request.comments[department] = dept_comments
        db.session.add(new_request)
        db.session.commit()
        db.session.refresh(new_request)

        establishment_entry = EstablishmentLogs(
            request_id=new_request.request_id)
        db.session.add(establishment_entry)
        db.session.commit()

    @role_required('client')
    def post(self):
        file = request.files.get('attachments')
        print(file)
        form_data = json.loads(request.form.get('form'))
        user: Users = current_user
        if user:
            filepath = None
            if file != None:
                filepath = filemanager.saveFile(file, user.id)
            print(form_data)
            form_data.pop('attachments')
            new_request: LTCRequests = LTCRequests(user_id=user.id)
            new_request.form, new_request.attachments = form_data, filepath
            self.initialiseApplication(new_request)
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)
        else:
            abort(400, status=jsonify(
                {'status': 'error', 'msg': 'user not found'}))


class ForwardLTC(Resource):
    def post(self):
        pass


class GetLtcFormData(Resource):
    @check_role()
    def post(self, **kwargs):
        request_id = json.loads(request.json)['request_id']
        if not request_id:
            abort(404, msg='Request ID not sent')
        form: LTCRequests = LTCRequests.query.get(int(request_id))
        if not form:
            abort(404, msg='Form not found')
        user_email = None
        if kwargs['permission'] == 'client':
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
    @check_role()
    def post(self, **kwargs):
        # print(request.data)
        # print(type(request.json))
        request_id = request.json['request_id']
        #request_id = request.data['request_id']
        print(request_id)
        if not request_id:
            abort(404, msg='Request ID not sent')
        form: LTCRequests = LTCRequests.query.get(request_id)
        if not form:
            abort(404, msg='Form not found')
        if kwargs['permission'] == 'client':
            if form.user_id != current_user.id:
                return abort(403, status={'error': 'Forbidden resource'})
        attachment_path = form.attachments
        if not attachment_path or attachment_path =="":
            return abort(404, status={'error': 'No attachment'})
        _, ext = os.path.splitext(attachment_path)
        filename = f'ltc_{request_id}_proofs'+ext
        abs_path = os.path.abspath(attachment_path)
        return send_file(abs_path, as_attachment=True, attachment_filename=filename)


# class temp_files(Resource):
#     def get(self):
#         return send_file(os.path.abspath('./static/1/1/Design document.pdf'), as_attachment=True)
#         # return send_file('./static/1/1/Design document.pdf', as_attachment=False)


class GetLtcFormMetaDataForUser(Resource):
    @role_required('client')
    def get(self):
        user: Users = current_user
        forms = LTCRequests.query.filter_by(user_id=user.id)
        results = []
        for form in forms:
            form: LTCRequests
            results.append({
                'request_id': form.request_id,
                'created_on': form.created_on,
                'stage': form.stage,
                'is_active': "Active" if form.is_active else "Not Active",
            })
        response = {'data': results}

        return jsonify(response)


class GetLtcFormMetaData(Resource):
    allowed_roles = [
        'admin',
        'deanfa',
        'registrar',
        'establishment',
        'accounts',
        'audit',
        'dept_head',
    ]

    @roles_required(roles=allowed_roles)
    def get(self):
        forms = db.session.query(LTCRequests, Users).join(Users).all()
        results = []
        for form, user in forms:
            form: LTCRequests
            user: Users
            results.append({
                'request_id': form.request_id,
                'user': user.email,
                'user_id': form.user_id,
                'created_on': form.created_on,
                'stage': form.stage,
                'is_active': form.is_active,
            })
        response = {'data': results}

        return jsonify(response)
