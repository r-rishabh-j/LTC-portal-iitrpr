from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
import os

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'abcd234i34-81-4 #$'
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')
    pgsql_path = os.environ.get('POSTGRES_PATH')
    app.config['SQLALCHEMY_DATABASE_URI'] = pgsql_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False

    db.init_app(app)
    api = Api(app)
    jwt = JWTManager(app)
    from .api import ApplyForLTC, TestInsert, RegisterUser, Logout, Login

    create_database(app)

    api.add_resource(ApplyForLTC, '/api/apply')
    api.add_resource(RegisterUser, '/api/register')
    api.add_resource(Login, '/api/login')
    api.add_resource(Logout, '/api/logout')
    api.add_resource(TestInsert, '/api/test')
    
    return app

def create_database(app):
    db.create_all(app=app)
    print('Created database')
