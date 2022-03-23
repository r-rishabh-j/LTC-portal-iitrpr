import os
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from .file_manager import FileManager
from datetime import timedelta

db = SQLAlchemy()
filemanager = FileManager(os.path.abspath('./static'))


def create_app(db_path=os.environ.get('POSTGRES_PATH')):
    app = Flask(__name__)
    CORS(app)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)
    app.config['UPLOAD_FOLDER'] = './static'

    db.init_app(app)
    api = Api(app)
    jwt = JWTManager(app)
    from .auth import RegisterUser, Logout, Login, IsLoggedIn
    from .ltc_manager import ApplyForLTC, GetLtcFormData, GetLtcFormMetaData, GetLtcFormMetaDataForUser, GetLtcFormAttachments, GetPendingApprovalRequests, \
        CommentOnLTC, GetPastApprovalRequests
    from .notifications import ClearUserNotifications, GetUserNotifications
    from .models import Users
    create_database(app)

    api.add_resource(ApplyForLTC, '/api/apply')
    api.add_resource(RegisterUser, '/api/register')
    api.add_resource(Login, '/api/login')
    api.add_resource(Logout, '/api/logout')
    api.add_resource(IsLoggedIn, '/api/is-logged-in')
    api.add_resource(GetLtcFormMetaData, '/api/get-form-meta')
    api.add_resource(GetLtcFormMetaDataForUser, '/api/getmyforms')
    api.add_resource(GetLtcFormData, '/api/getformdata')
    api.add_resource(GetLtcFormAttachments, '/api/getattachments')
    api.add_resource(GetPendingApprovalRequests, '/api/getpendingltc')
    api.add_resource(GetPastApprovalRequests, '/api/getpastltc')
    api.add_resource(CommentOnLTC, '/api/comment')
    api.add_resource(GetUserNotifications, '/api/getnotifications')
    api.add_resource(ClearUserNotifications, '/api/clearnotifications')

    @jwt.user_identity_loader
    def user_identity_loader(user: Users):
        return user.email

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        email = jwt_data.get('sub', None)
        return Users.query.filter_by(email=email).one_or_none()

    return app


def create_database(app):
    db.create_all(app=app)
    print('Created database')
