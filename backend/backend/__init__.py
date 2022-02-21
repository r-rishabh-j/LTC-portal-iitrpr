from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_restful import Resource, Api

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'abcd234i34-81-4 #$'
    pgsql_path = "postgresql+psycopg2://postgres:pgh1h2@localhost:5432/ltc_app"
    app.config['SQLALCHEMY_DATABASE_URI'] = pgsql_path

    db.init_app(app)
    api = Api(app)

    # from .views import views
    # from .auth import auth
    from .api import ApplyForLTC, TestInsert, RegisterUser, Logout, Login

    # app.register_blueprint(auth, url_prefix='/')
    # app.register_blueprint(views, url_prefix='/')

    from .models import Users, LTCApproved, test_table, LTCRequests
    create_database(app)

    # login_manager = LoginManager()
    # login_manager.login_view = 'auth.login'
    # login_manager.init_app(app)
    login_manager = LoginManager()
    login_manager.init_app(app)

    api.add_resource(ApplyForLTC, '/api/apply')
    api.add_resource(RegisterUser, '/api/register')
    api.add_resource(Login, '/api/login')
    api.add_resource(Logout, '/api/logout')
    api.add_resource(TestInsert, '/api/test')

    @login_manager.user_loader
    def load_user(id):
        return Users.query.get(int(id))
    return app


def create_database(app):
    db.create_all(app=app)
    print('Created database')