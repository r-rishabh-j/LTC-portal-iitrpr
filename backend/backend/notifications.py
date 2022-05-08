from urllib import request, response
from . import db
from flask import jsonify, request, abort
from flask_restful import Resource
from .models import Users
from flask_jwt_extended import current_user
from .role_manager import check_role
import json


class GetUserNotifications(Resource):
    @check_role()
    def get(self, **kwargs):
        user: Users = current_user
        return jsonify(user.notifications)


class ClearUserNotifications(Resource):
    @check_role()
    def get(self, **kwargs):
        user: Users = current_user
        user.clearNotifications()
        db.session.commit()
        return jsonify({'msg': 'Notifications cleared'})

class GetEmailPref(Resource):
    @check_role()
    def get(self, **kwargs):
        return {'pref': current_user.email_pref}

class SetEmailPref(Resource):
    @check_role()
    def post(self, **kwargs):
        setting = json.loads(request.data)
        pref = setting.get('pref')
        if pref not in [True, False]:
            abort(400)
        current_user.email_pref = bool(pref)
        db.session.commit()
        return {'pref': current_user.email_pref}