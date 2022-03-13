from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, current_user
from flask import make_response, jsonify
from .models import Users

permissions = {
    'admin': 1,
    'deanfa': 2,
    'registrar': 3,
    'establishment': 4,
    'accounts': 5,
    'audit': 6,
    'dept_head': 7,
    'leaf': 8,
    'applicant': 8,
    'client': 8,
}
"""
Defines role of a user
"""


def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user: Users = current_user
            print(user.id)
            if user.permission == role:
                return fn(*args, **kwargs)
            else:
                return make_response(jsonify(msg="Forbidden"), 403)
        return decorator
    return wrapper


def roles_required(roles: list):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user: Users = current_user
            if user.permission in roles:
                kwargs['permission'] = str(user.permission)
                return fn(*args, **kwargs)
            else:
                return make_response(jsonify(msg="Forbidden"), 403)
        return decorator
    return wrapper


def check_role():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user: Users = current_user
            if user.permission in permissions:
                kwargs['permission'] = user.permission
                return fn(*args, **kwargs)
            else:
                return make_response(jsonify(msg="Forbidden"), 403)
        return decorator
    return wrapper
