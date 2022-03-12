import os
import json
import requests
from . import db
from . import filemanager
from flask import jsonify, request, make_response, redirect
from flask_restful import Resource, reqparse, marshal_with, abort, fields
from .models import Users
from flask_jwt_extended import create_access_token, unset_access_cookies, jwt_required, \
    set_access_cookies, unset_jwt_cookies, get_jwt_identity, verify_jwt_in_request, get_jwt
from .role_manager import permissions, role_required, roles_required


class RegisterUser(Resource):
    @role_required(role='admin')
    def post(self):
        return {'Error': 'Not implemented'}


class Logout(Resource):
    def post(self):
        response = jsonify({"msg": "logout successful"})
        print(response)
        unset_jwt_cookies(response)
        return response


class IsLoggedIn(Resource):
    @jwt_required()
    def get(self):
        email = get_jwt_identity()
        claims = get_jwt()
        # user = Users.query.filter_by(email=email).first()
        # if not user:
        #     return make_response({}, 401)
        # TODO: add user details such as profile pic, name, email, etc if logged in
        return jsonify({
            'status': 'logged-in',
            'claims': claims['claims']
        })


class Login(Resource):
    def googleLogin(self, code):
        data = {
            'code': code,
            'client_id': os.environ.get('client_id'),
            'client_secret': os.environ.get('client_secret'),
            'redirect_uri': "http://localhost:5000/api/login",
            'grant_type': 'authorization_code'
        }
        response = requests.post(
            'https://oauth2.googleapis.com/token', data=data)
        if not response.ok:
            return make_response(redirect('http://localhost:3000'))
        access = response.json()['access_token']

        response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            params={'access_token': access}
        )

        if not response.ok:
            return make_response(redirect('http://localhost:3000'))

        return response.json()

    def get(self):
        code = request.args.to_dict().get('code', None)
        if not code:
            return make_response(redirect('http://localhost:3000'))
        googleResponse = self.googleLogin(code)
        print(googleResponse)
        email = str(googleResponse['email'])
        user: Users = Users.lookUpByEmail(email)
        if not user:
            return make_response(redirect('http://localhost:3000'))
        access_tk = create_access_token(
            identity=email, additional_claims={
                'claims': {
                    'permission': user.permission,
                    'name': user.name,
                    'department': user.department,
                    'picture': user.picture
                }
            })
        response = make_response(redirect('http://localhost:3000'))
        set_access_cookies(response, access_tk)
        return response

    # def post(self):
    #     args = login_user_args.parse_args()
    #     if not args['email'] or len(args['email']) < 4:
    #         abort(409, 'invalid email')
    #     user = Users.query.filter_by(email=args['email']).first()

    #     if not user:
    #         abort(409, message="user does not exist")

    #     user_cred = UserCredentials.query.filter_by(
    #         email=args['email']).first()
    #     if str(args['password']) != user_cred.password:
    #         abort(409, message='invalid password')

    #     # login_user(user)
    #     # access_token = create_access_token(identity=args['email'])
    #     # return {
    #     #     'login': 'user logged in successfully',
    #     #      "access_token": access_token
    #     # }, 201
    #     response = make_response({'login': 'user logged in successfully'})
    #     set_access_cookies(
    #         response, create_access_token(identity=args['email']))
    #     return response


# p = reqparse.RequestParser()
# p.add_argument('a', type=int)
# p.add_argument('b', type=dict)
# p.add_argument('c', type=dict)


class TestInsert(Resource):
    @jwt_required()
    def get(self):
        print("TEST")

        return {}, 200

    @jwt_required()
    def post(self):

        # data = request.form
        # data = data.to_dict(flat=False)
        # print(data)
        # db.session.add(new_entry)
        # db.session.commit()
        # new_entry = test_table(data)
        # db.session.add(new_entry)
        # db.session.commit()
        return {"success": "inserted"}, 201
