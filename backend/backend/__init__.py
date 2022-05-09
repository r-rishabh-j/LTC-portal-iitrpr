import os
from flask_cors import CORS
from flask_restful import Api
from flask import Flask, make_response, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, get_jwt, create_access_token, set_access_cookies, current_user
from flask_migrate import Migrate
import redis
from rq import Queue
from .file_manager import create_file_manager
from .email_manager.email_manager import EmailManager
from dotenv import load_dotenv
import redis
from rq import Queue

load_dotenv()
db = SQLAlchemy()
UPLOAD_FOLDER = 'uploads'

redis_conn = redis.Redis()
task_queue = Queue(connection=redis_conn)

filemanager = create_file_manager(upload_folder=UPLOAD_FOLDER)

enable_email = False
if os.environ.get("ENABLE_EMAIL") == 'true':
    enable_email = True
emailmanager = EmailManager(enabled=enable_email, queue={'queue': task_queue})


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
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 15 * 1024 * 1024

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

    from .auth import Auth
    from .ltc_manager import LtcManager
    from .notifications import ClearUserNotifications, GetUserNotifications, GetEmailPref, SetEmailPref
    # migrate = Migrate(app, db)

    api.add_resource(Auth.Login, '/api/login')
    api.add_resource(Auth.Logout, '/api/logout')
    api.add_resource(Auth.IsLoggedIn, '/api/is-logged-in')
    api.add_resource(LtcManager.ApplyForLTC, '/api/apply')
    api.add_resource(Auth.RegisterUser, '/api/register')
    api.add_resource(Auth.GetSignature, '/api/get-signature')
    api.add_resource(Auth.UploadSignature, '/api/upload-signature')
    api.add_resource(LtcManager.GetLtcFormData, '/api/getformdata')
    api.add_resource(LtcManager.GetLtcFormMetaData, '/api/get-form-meta')
    api.add_resource(LtcManager.GetLtcFormMetaDataForUser, '/api/getmyforms')
    api.add_resource(LtcManager.GetLtcFormAttachments, '/api/getattachments')
    api.add_resource(LtcManager.GetPendingApprovalRequests,
                     '/api/getpendingltc')
    api.add_resource(LtcManager.GetPastApprovalRequests, '/api/getpastltc')
    api.add_resource(LtcManager.CommentOnLTC, '/api/comment')
    api.add_resource(LtcManager.FillStageForm, '/api/fill-stage-form')
    api.add_resource(GetUserNotifications, '/api/getnotifications')
    api.add_resource(GetEmailPref, '/api/get-email-pref')
    api.add_resource(SetEmailPref, '/api/set-email-pref')
    api.add_resource(ClearUserNotifications, '/api/clearnotifications')
    api.add_resource(LtcManager.GetEstablishmentReview,
                     '/api/establishment-review')
    api.add_resource(LtcManager.UploadOfficeOrder, '/api/upload-office-order')
    api.add_resource(LtcManager.GetOfficeOrder, '/api/get-office-order')
    api.add_resource(LtcManager.GetPendingOfficeOrderRequests,
                     '/api/get-pending-office-order-req')
    api.add_resource(LtcManager.GetPendingAdvancePaymentRequests,
                     '/api/get-pending-advance-payments')
    api.add_resource(LtcManager.UpdateAdvancePaymentDetails,
                     '/api/update-advance-payment')
    api.add_resource(LtcManager.ResolveReviewRequest,
                     '/api/resolve-review')
    api.add_resource(LtcManager.EditStageForm,
                     '/api/edit-stage-form')
    api.add_resource(LtcManager.PrintForm,
                     '/api/print-form')

    @jwt.user_identity_loader
    def user_identity_loader(user: Users):
        return user.email

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        email = jwt_data.get('sub', None)
        return Users.query.filter_by(email=email).one_or_none()

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
