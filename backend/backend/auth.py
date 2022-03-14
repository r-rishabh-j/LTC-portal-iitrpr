import os
import json
import requests
from . import db
from flask import jsonify, request, make_response, redirect
from flask_restful import Resource, reqparse, marshal_with, abort, fields
from .models import Users
from flask_jwt_extended import create_access_token, jwt_required, \
    set_access_cookies, unset_jwt_cookies, current_user
from .role_manager import role_required


class RegisterUser(Resource):
    @role_required(role='admin')
    def post(self):
        return {'Error': 'Not implemented'}


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
        # TODO: add user details such as profile pic, name, email, etc if logged in
        return jsonify({
            'status': 'logged-in',
            'claims': {
                'permission': user.permission,
                'name': user.name,
                'email': user.email,
                'department': user.department,
                'picture': user.picture
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
            # return make_response(redirect(os.environ.get('FRONTEND_URL')))
            return None
        access = response.json()['access_token']

        response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            params={'access_token': access}
        )

        if not response.ok:
            # return make_response(redirect(os.environ.get('FRONTEND_URL')))
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
        user = Users.query.filter_by(email=args['email']).one_or_none()

        if not user:
            abort(409, message="user does not exist")

        access_tk = create_access_token(identity=user)
        response = make_response(redirect(os.environ.get('FRONTEND_URL')))
        set_access_cookies(response, access_tk)
        return response


class TestInsert(Resource):
    @jwt_required()
    def get(self):
        print("TEST")
        return {}, 200

    @jwt_required()
    def post(self):
        return {"success": "inserted"}, 201
