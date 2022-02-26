import re
from flask import Flask, jsonify, request, flash
from flask_login import login_required, login_user, logout_user
from flask_restful import Resource, reqparse, marshal_with, abort, fields
import json
from .models import Users, LTCRequests, test_table, UserCredentials
from . import db
from .reqParser import register_user_args, login_user_args
from flask_jwt_extended import create_access_token, unset_access_cookies, jwt_required, set_access_cookies, unset_jwt_cookies, get_jwt_identity


class RegisterUser(Resource):
    def post(self):
        args = register_user_args.parse_args()
        if not args['email'] or len(args['email']) < 4:
            abort(409, message="invalid email")

        if Users.query.filter_by(email=args['email']).first():
            abort(409, message="user already exists")
        # TODO: ensure password is hashed
        # validate credential lengths
        if not args['password'] or len(args['password']) < 3:
            abort(409, message='invalid password')

        new_user = Users(
            email=args['email'], name=args['name'], department=args['department'])
        new_user_cred = Users(email=args['email'], password=args['password'])
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=args['email'])
        response = {"success": 'User account created successfully'}
        set_access_cookies(response, access_token)
        # login_user(new_user, remember=True)
        return response, 201


class ApplyForLTC(Resource):
    @jwt_required()
    def post(self):
        data = json.loads(request.data)
        email = get_jwt_identity()
        # user_id = data['userID']
        user = Users.query.filter(email=email).first()
        if user:
            new_request = LTCRequests(userID=user.id)
            db.session.add(new_request)
            db.session.commit()
            flash('Request send', category='success')
        else:
            flash('Error', category='error')


class Logout(Resource):
    @jwt_required()
    def post(self):
        print(response)
        response = jsonify({"msg": "logout successful"})
        unset_jwt_cookies(response)
        return response


class Login(Resource):
    def get(self):

        return {
            "login-page": "Login"
        }, 200

    def post(self):
        args = login_user_args.parse_args()
        if not args['email'] or len(args['email']) < 4:
            abort(409, 'invalid email')
        user = Users.query.filter_by(email=args['email']).first()

        if not user:
            abort(409, message="user does not exist")

        user_cred = UserCredentials.query.filter_by(
            email=args['email']).first()
        if str(args['password']) != user_cred.password:
            abort(409, message='invalid password')

        # login_user(user)
        access_token = create_access_token(identity=args['email'])
        return {
            'login': 'user logged in successfully',
             "access_token": access_token
        }, 201


p = reqparse.RequestParser()
p.add_argument('a', type=int)
p.add_argument('b', type=dict)
p.add_argument('c', type=dict)


class TestInsert(Resource):
    @jwt_required()
    def get(self):
        print("TEST")

        return {},200

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
