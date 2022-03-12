import json
import os
from . import db
from . import filemanager
from flask import jsonify, request, make_response, redirect, send_from_directory, send_file
from flask_restful import Resource, reqparse, abort, fields
from .models import Users, LTCRequests
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from .role_manager import role_required, roles_required, check_role


class ApplyForLTC(Resource):
    @role_required('client')
    def post(self):
        file = request.files.get('attachments')
        print(request.data)
        print(file)
        form_data = json.loads(request.form.get('form'))
        email = get_jwt_identity()
        user: Users = Users.lookUpByEmail(email)
        if user:
            filepath = None
            if file != None:
                filepath = filemanager.saveFile(file, user.id)
            print(form_data)
            form_data.pop('attachments')
            new_request: LTCRequests = LTCRequests(user_id=user.id)
            new_request.form = form_data
            new_request.attachments = filepath
            db.session.add(new_request)
            db.session.commit()
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)
        else:
            abort(400, status=jsonify(
                {'status': 'error', 'msg': 'user not found'}))


class GetLtcFormData(Resource):
    @check_role()
    def post(self, **kwargs):
        request_id = json.loads(request.json)['request_id']
        form: LTCRequests = LTCRequests.query.get(request_id)
        user_email = None
        if kwargs['permission'] == 'client':
            user_email = get_jwt_identity()
            check_user: Users = Users.lookUpByEmail(user_email)
            if form.user_id != check_user.id:
                return abort(403, status={'error': 'Forbidden resource'})
        form_data = dict(form.form)
        if not user_email:
            user_email = Users.query.get(form.user_id).email
        result = {
            'request_id': form.request_id,
            'email': user_email,
            'created_on': form.created_on,
            'stage': form.stage,
            'is_active': form.is_active,
            'form_data': form_data,
            'comments': form.comments
        }
        response = {'data': result}

        return jsonify(response)


class GetLtcFormAttachments(Resource):
    @check_role()
    def post(self, **kwargs):
        request_id = json.loads(request.json)['request_id']
        form: LTCRequests = LTCRequests.query.get(request_id)
        if kwargs['permission'] == 'client':
            user_email = get_jwt_identity()
            check_user: Users = Users.lookUpByEmail(user_email)
            if form.user_id != check_user.id:
                return abort(403, status={'error': 'Forbidden resource'})
        attachment_path = form.attachments
        _, ext = os.path.splitext(attachment_path)
        filename = f'ltc_{request_id}_proofs'+ext
        abs_path = os.path.abspath(attachment_path)
        return send_file(abs_path, as_attachment=True, attachment_filename=filename)


class temp_files(Resource):
    def get(self):
        return send_file(os.path.abspath('./static/1/1/Design document.pdf'), as_attachment=True)
        # return send_file('./static/1/1/Design document.pdf', as_attachment=False)


class GetLtcFormMetaDataForUser(Resource):
    @role_required('client')
    def get(self):
        email = get_jwt_identity()
        user: Users = Users.lookUpByEmail(email)
        forms = LTCRequests.query.filter_by(user_id=user.id)
        results = []
        for form in forms:
            form: LTCRequests
            results.append({
                'request_id': form.request_id,
                'created_on': form.created_on,
                'stage': form.stage,
                'is_active': form.is_active,
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
