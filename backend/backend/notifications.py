from . import db
from flask import jsonify
from flask_restful import Resource
from .models import Users
from flask_jwt_extended import current_user
from .role_manager import check_role


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
