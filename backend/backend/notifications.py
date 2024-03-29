import json
from . import db
from .models import Users
from urllib import request
from flask import jsonify, request, abort
from flask_restful import Resource
from flask_jwt_extended import current_user
from .role_manager import check_role
import time


class GetUserNotifications(Resource):
    """Fetch dashboard notifications"""
    @check_role()
    def get(self, **kwargs):
        user: Users = current_user
        return jsonify(user.notifications)


class ClearUserNotifications(Resource):
    """Clear dashboard notifications"""
    @check_role()
    def get(self, **kwargs):
        user: Users = current_user
        user.clearNotifications()
        db.session.commit()
        return jsonify({'msg': 'Notifications cleared'})


class GetEmailPref(Resource):
    @check_role()
    def get(self, **kwargs):
        """
        @return json:{
            'pref': <bool>
        }
        """
        return {'pref': current_user.email_pref}


class SetEmailPref(Resource):
    @check_role()
    def post(self, **kwargs):
        """
        @params: data:{
            'pref': <bool>
        }
        """
        setting = json.loads(request.data)
        pref = setting.get('pref')
        if pref not in [True, False]:
            abort(400)
        current_user.email_pref = bool(pref)
        db.session.commit()
        return {'pref': current_user.email_pref}
