import os
import json
import requests
from . import db
from . import filemanager
from flask import jsonify, request, make_response, redirect
from flask_restful import Resource, reqparse, marshal_with, abort, fields
from .models import Users, LTCRequests, test_table
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request, get_jwt
from .role_manager import permissions, role_required, roles_required


class ApplyForLTC(Resource):
    # @jwt_required()
    @role_required('client')
    def post(self):
        file = request.files.get('attachments')
        print(file)
        form_data = json.loads(request.form.get('form'))
        email = get_jwt_identity()
        user: Users = Users.lookUpByEmail(email)
        if user:
            filepath = None
            if file != None:
                filepath = filemanager.saveFile(file, user.id)
            form_data['attachments'] = filepath
            print(form_data)
            new_request = LTCRequests(user_id=user.id)
            new_request.form = form_data
            db.session.add(new_request)
            db.session.commit()
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)
        else:
            abort(400, status=jsonify(
                {'status': 'error', 'msg': 'user not found'}))


class GetLtcFormsForUser(Resource):
    @jwt_required()
    def get(self):
        email = get_jwt_identity()
        user: Users = Users.lookUpByEmail(email)
        forms = LTCRequests.query.filter_by(user_id=user.id)
        for form in forms:
            pass


class GetLtcForms(Resource):
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
    def post(self):
        pass
