from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_restful import Resource, Api
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')
    pgsql_path = os.environ.get('POSTGRES_PATH')
    app.config['SQLALCHEMY_DATABASE_URI'] = pgsql_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False

    db.init_app(app)
    api = Api(app)
    jwt = JWTManager(app)
    from .api import ApplyForLTC, TestInsert, RegisterUser, Logout, Login, IsLoggedIn

    create_database(app)

    api.add_resource(ApplyForLTC, '/api/apply')
    api.add_resource(RegisterUser, '/api/register')
    api.add_resource(Login, '/api/login')
    api.add_resource(Logout, '/api/logout')
    api.add_resource(TestInsert, '/api/test')
    api.add_resource(IsLoggedIn, '/api/is-logged-in')

    return app


def create_database(app):
    db.create_all(app=app)
    print('Created database')
