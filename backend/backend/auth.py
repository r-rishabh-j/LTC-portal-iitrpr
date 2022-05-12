from datetime import date, datetime
import os
import json
import requests
from . import db, filemanager
from flask import jsonify, request, make_response, redirect
from flask_restful import Resource, abort
from .models import Departments, UserOTP, Users
from flask_jwt_extended import create_access_token, jwt_required, \
    set_access_cookies, unset_jwt_cookies, current_user
from .role_manager import check_role, role_required, Permissions
from uuid import uuid4
import urllib.parse
from . import emailmanager

class Auth:
    class RegisterUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):
            """
            Send post request to register user
            """
            name = request.form.get('name')
            email = request.form.get('email')
            department = request.form.get('department')
            role = request.form.get('role')

            if None in [name, email, department, role]:
                abort(400, 'invalid request')

            return {'error': 'Not implemented'}, 500

    class EditUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):

            return {'error': 'Not implemented'}, 500

    class DropUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):

            return {'error': 'Not implemented'}, 500

    class Logout(Resource):
        def post(self):
            response = jsonify({"msg": "logout successful"})
            unset_jwt_cookies(response)
            return response

    class IsLoggedIn(Resource):
        """
        Check whether user is logged in.
        If logged in, send user metadata
        """
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
            """
            Google OAuth
            """
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
            """
            Only for development
            """
            if os.environ.get('FLASK_ENV') == None:
                abort(404, error="No such route")
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

    class OTPLogin(Resource):
        def post(self):
            email = str(request.json.get('email')).strip().lower()
            print(email)
            if not email or len(email) < 4:
                abort(409, 'invalid email')
            user: Users = Users.query.filter_by(
                email=str(email).strip().lower()).one_or_none()
            if not user:
                abort(409, error="User not registered")

            previous_otp_entry: UserOTP = UserOTP.query.get(user.email)
            current_time = datetime.now()
            if previous_otp_entry != None:
                if previous_otp_entry.valid_till > current_time:
                    abort(
                        400, error='OTP already generated. Kindly Check your Email Account.')
                else:
                    db.session.delete(previous_otp_entry)

            otp = uuid4()
            login_otp: UserOTP = UserOTP(user.email, otp)
            db.session.add(login_otp)
            params = {
                'user': user.email,
                'otp': otp,
            }
            login_url = f"{os.environ.get('BACKEND_URL')}/api/otp-login?" + \
                urllib.parse.urlencode(params)
            print(login_url)
            db.session.commit()
            emailmanager.sendLoginOTP(user, login_url)
            return {'success': 'login link sent on email!'}

        def get(self):
            email = str(request.args.get('user')).strip().lower()  # email
            otp = request.args.get('otp')
            if email == None or otp == None:
                abort(400, error='unauthorized')
            user: Users = Users.query.filter(
                Users.email == email).one_or_none()
            if not user:
                abort(404, error='Invalid Email')
            otp_entry: UserOTP = UserOTP.query.get(email)
            if otp_entry == None:
                abort(400, error='No OTP found for User')
            if otp_entry.otp != otp:
                abort(400, error='Invalid OTP!')
            current_time = datetime.now()
            valid_till = otp_entry.valid_till
            db.session.delete(otp_entry)
            db.session.commit()
            if current_time > valid_till:
                abort(400, error='OTP Expired! Login Again!')
            access_tk = create_access_token(identity=user)
            response = make_response(redirect(os.environ.get('FRONTEND_URL')))
            set_access_cookies(response, access_tk)
            return response

    class UploadSignature(Resource):
        """
        Upload user signature
        POST request
        Only .png, .jpeg/.jpg files allowed.
        """
        @check_role()
        def post(self, permission):
            """
            Payload:
            {
                'signature': <File>
            }
            """
            user: Users = current_user
            sign = request.files.get('signature', None)
            if (os.path.splitext(str(sign.filename).lower())[1] not in ['.png', '.jpeg', '.jpg']):
                abort(400, error='invalid file type')
            try:
                user.signature = filemanager.fileAsB64(sign)
            except Exception as e:
                return abort(400, error=f'{e}')
            db.session.commit()
            return {'success': 'Signature Uploaded'}

    class GetSignature(Resource):
        """
        Fetch user signature as base64 encoded string
        """
        @check_role()
        def post(self, permission):
            sign = current_user.signature
            return {'signature': sign}
