from flask import Flask, jsonify, request, flash
from flask_login import login_required, current_user, login_user, logout_user
from flask_restful import Resource, Api, reqparse, marshal_with, abort, fields
import json
from .models import Users, LTCRequests, test_table
from . import db
from .reqParser import register_user_args, login_user_args


class RegisterUser(Resource):
    def post(self):
        args = register_user_args.parse_args()
        if not args['email'] or len(args['email']) < 4:
            abort(409, message="invalid email")

        if Users.query.filter_by(email=args['email']).first():
            abort(409, message="user already exists")
        # ensure password is hashed
        # validate credential lengths
        if not args['password'] or len(args['password']) < 3:
            abort(409, message='invalid password')

        new_user = Users(email=args['email'], name=args['name'], department=args['department'])
        new_user_cred = Users(email=args['email'], password=args['password'])
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember=True)
        return {"success": 'User account created successfully'}, 201


class ApplyForLTC(Resource):
    @login_required
    def post(self):
        data = json.loads(request.data)
        user_id = current_user.id
        # user_id = data['userID']
        user = Users.query.get(user_id)
        if user:
            new_request = LTCRequests(userID=user_id)
            db.session.add(new_request)
            db.session.commit()
            flash('Request send', category='success')
        else:
            flash('Error', category='error')


class Logout(Resource):
    @login_required
    def get(self):
        logout_user()
        return {'logout': 'user logged out successfully'}


class Login(Resource):
    def post(self):
        args = login_user_args.parse_args()
        if not args['email'] or len(args['email']) < 4:
            abort(409, 'invalid email')
        user = Users.query.filter_by(email=args['email']).first()

        if not user:
            abort(409, message="user does not exist")

        if str(args['password']) != user.password:
            abort(409, message='invalid password')

        login_user(user)
        return {'login': 'user logged in successfully'}


p = reqparse.RequestParser()
p.add_argument('a', type=int)
p.add_argument('b', type=dict)
p.add_argument('c', type=dict)


class TestInsert(Resource):
    def put(self):
        
        # data = request.form
        # data = data.to_dict(flat=False)
        # print(data)
        # j = {"Rishabh":1, "Math": {'HE': '44'}, "Est":1}
        # new_entry = test_table(j)
        # db.session.add(new_entry)
        # db.session.commit()
        # new_entry = test_table(data)
        # db.session.add(new_entry)
        # db.session.commit()
        return {"success": "inserted"}, 201
