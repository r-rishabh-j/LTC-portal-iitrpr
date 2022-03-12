import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import  Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .file_manager import FileManager

db = SQLAlchemy()
filemanager = FileManager('./static')

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')
    pgsql_path = os.environ.get('POSTGRES_PATH')
    app.config['SQLALCHEMY_DATABASE_URI'] = pgsql_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False

    db.init_app(app)
    auth = Api(app)
    jwt = JWTManager(app)
    from .auth import TestInsert, RegisterUser, Logout, Login, IsLoggedIn
    from .ltc_manager import ApplyForLTC, GetLtcFormData, GetLtcFormMetaData, GetLtcFormMetaDataForUser

    create_database(app)

    auth.add_resource(ApplyForLTC, '/api/apply')
    auth.add_resource(RegisterUser, '/api/register')
    auth.add_resource(Login, '/api/login')
    auth.add_resource(Logout, '/api/logout')
    auth.add_resource(TestInsert, '/api/test')
    auth.add_resource(IsLoggedIn, '/api/is-logged-in')
    auth.add_resource(GetLtcFormMetaDataForUser, '/api/get-form-meta')
    auth.add_resource(GetLtcFormMetaData, '/api/getmyforms')
    auth.add_resource(GetLtcFormData, '/api/getformdata')

    return app


def create_database(app):
    db.create_all(app=app)
    print('Created database')
