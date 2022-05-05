import os
import json
from tabnanny import check
import requests
from . import db, filemanager
from flask import jsonify, request, make_response, redirect
from flask_restful import Resource, abort
from .models import Departments, Users
from flask_jwt_extended import create_access_token, jwt_required, \
    set_access_cookies, unset_jwt_cookies, current_user
from markupsafe import escape
from .role_manager import check_role, role_required, Permissions
from PIL import Image


class Auth:
    class RegisterUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):

            return {'error': 'Not implemented'}, 500

    class Logout(Resource):
        def post(self):
            response = jsonify({"msg": "logout successful"})
            unset_jwt_cookies(response)
            return response

    class IsLoggedIn(Resource):
        @jwt_required()
        def get(self):

            user: Users = current_user
            if not user:
                return abort(401, msg='Login again')
            user_dept: Departments = Departments.query.get(user.department)
            return jsonify({
                'status': 'logged-in',
                'claims': {
                    'permission': user.permission,
                    'designation': user.designation,
                    'name': user.name,
                    'email': user.email,
                    'department': user_dept.full_name,
                    'picture': user.picture,
                    'employee_code': user.employee_code
                }
            })

    class Login(Resource):
        def googleLogin(self, code):
            data = {
                'code': code,
                'client_id': os.environ.get('client_id'),
                'client_secret': os.environ.get('client_secret'),
                'redirect_uri': f"{os.environ.get('BACKEND_URL')}/api/login",
                'grant_type': 'authorization_code'
            }
            response = requests.post(
                'https://oauth2.googleapis.com/token', data=data)
            if not response.ok:
                return None
            access = response.json()['access_token']

            response = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                params={'access_token': access}
            )

            if not response.ok:
                return None

            return response.json()

        def get(self):
            code = request.args.to_dict().get('code', None)
            if not code:
                return make_response(redirect(os.environ.get('FRONTEND_URL')))
            googleResponse = self.googleLogin(code)
            if not googleResponse:
                return make_response(redirect(os.environ.get('FRONTEND_URL')))
            print(googleResponse)
            email = str(googleResponse['email'])
            user: Users = Users.lookUpByEmail(email)
            if not user:
                return make_response(redirect(os.environ.get('FRONTEND_URL')))
            user.picture = googleResponse['picture']
            access_tk = create_access_token(identity=user)
            response = make_response(redirect(os.environ.get('FRONTEND_URL')))
            set_access_cookies(response, access_tk)
            db.session.commit()
            return response

        def post(self):
            args = json.loads(request.form.get('auth'))
            if not args['email'] or len(args['email']) < 4:
                abort(409, 'invalid email')
            user = Users.query.filter_by(
                email=str(args['email']).strip().lower()).one_or_none()

            if not user:
                abort(409, message="user does not exist")

            access_tk = create_access_token(identity=user)
            response = make_response(redirect(os.environ.get('FRONTEND_URL')))
            set_access_cookies(response, access_tk)
            return response

    class UploadSignature(Resource):
        @check_role()
        def post(self, permission):
            user: Users = current_user
            sign = request.files.get('signature', None)
            print(sign)
            try:
                path = filemanager.saveSignature(sign, current_user.id)
                user.signature = path
            except Exception as e:
                return abort(400, error=f'{e}')
            db.session.commit()
            return {'success': 'Signature Uploaded'}

    class GetSignature(Resource):
        @check_role()
        def post(self, permission):
            sign_path = current_user.signature
            # sign_path = '../dashboard/src/Components/Body/Dashboard/sign.jpeg'
            if sign_path == None or str(sign_path).isspace():
                return filemanager.sendFile('./static/no-sign.png', 'no-sign.png')
            print(os.path.split(sign_path)[1])
            return filemanager.sendFile(sign_path, os.path.split(sign_path)[1])
