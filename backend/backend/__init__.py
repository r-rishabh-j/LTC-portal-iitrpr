import os
from flask_cors import CORS
from flask_restful import Api
from flask import Flask, make_response, redirect, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, get_jwt, create_access_token, set_access_cookies, current_user
from flask_migrate import Migrate
from .file_manager import create_file_manager
from dotenv import load_dotenv

load_dotenv()
db = SQLAlchemy()
UPLOAD_FOLDER = 'uploads'
filemanager = create_file_manager(upload_folder=UPLOAD_FOLDER)

def create_app(db_path=os.environ.get('POSTGRES_PATH')):
    app = Flask(__name__, static_url_path='', template_folder=os.path.abspath(
        './build'), static_folder=os.path.abspath('./build'))
    CORS(app)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_POOL_TIMEOUT'] = 5
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=60)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    # app.config['JWT_COOKIE_DOMAIN'] =  os.environ.get('COOKIE_DOMAIN') # TODO: enable in production

    app.config["flask_profiler"] = {
        "enabled": True,
        "storage": {
            "engine": "sqlalchemy",
            "db_url": db_path
        },
        "ignore": [
            "^/analytics/.*",
            "^/static/.*"
        ],
    }

    db.init_app(app)
    from .models import Users
    create_database(app)

    import backend.flask_profiler as flask_profiler
    flask_profiler.init_app(app)
    api = Api(app)
    jwt = JWTManager(app)

    from .auth import RegisterUser, Logout, Login, IsLoggedIn
    from .ltc_manager import LtcManager
    from .notifications import ClearUserNotifications, GetUserNotifications
    # migrate = Migrate(app, db)

    api.add_resource(Login, '/api/login')
    api.add_resource(Logout, '/api/logout')
    api.add_resource(IsLoggedIn, '/api/is-logged-in')
    api.add_resource(LtcManager.ApplyForLTC, '/api/apply')
    api.add_resource(RegisterUser, '/api/register')
    api.add_resource(LtcManager.GetLtcFormData, '/api/getformdata')
    api.add_resource(LtcManager.GetLtcFormMetaData, '/api/get-form-meta')
    api.add_resource(LtcManager.GetLtcFormMetaDataForUser, '/api/getmyforms')
    api.add_resource(LtcManager.GetLtcFormAttachments, '/api/getattachments')
    api.add_resource(LtcManager.GetPendingApprovalRequests, '/api/getpendingltc')
    api.add_resource(LtcManager.GetPastApprovalRequests, '/api/getpastltc')
    api.add_resource(LtcManager.CommentOnLTC, '/api/comment')
    api.add_resource(LtcManager.FillStageForm, '/api/fill-stage-form')
    api.add_resource(GetUserNotifications, '/api/getnotifications')
    api.add_resource(ClearUserNotifications, '/api/clearnotifications')
    api.add_resource(LtcManager.GetEstablishmentReview, '/api/establishment-review')
    api.add_resource(LtcManager.UploadOfficeOrder, '/api/upload-office-order')

    @jwt.user_identity_loader
    def user_identity_loader(user: Users):
        return user.email

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        email = jwt_data.get('sub', None)
        return Users.query.filter_by(email=email).one_or_none()

    # @app.before_request
    # @flask_profiler.profile()
    # def analyse():
    #     """Empty function, just runs before a route to analyse"""
    #     pass

    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now()
            target_timestamp = datetime.timestamp(now + timedelta(minutes=10))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=current_user)
                set_access_cookies(make_response(response), access_token)
            return response
        except:
            return response

    @app.route('/', methods=['GET'])
    def home():
        return render_template('index.html')

    return app


def create_database(app):
    db.create_all(app=app)
