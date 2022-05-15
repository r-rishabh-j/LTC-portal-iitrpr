import os
from flask_cors import CORS
from flask_restful import Api
from flask import Flask, make_response, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, get_jwt, create_access_token, set_access_cookies, current_user
import redis
from rq import Queue

from .file_manager.encoded_file_manager import EncodedFileManager
from .email_manager.background_email_manager import EmailManager
from dotenv import load_dotenv

load_dotenv()
db = SQLAlchemy()

redis_conn = redis.Redis()
task_queue = Queue(connection=redis_conn)

filemanager = EncodedFileManager()

enable_email = False
if os.environ.get("ENABLE_EMAIL") == 'true':
    enable_email = True
emailmanager = EmailManager(enabled=enable_email, queue={})
MAX_UPLOAD_SIZE = 50*1024*1024


def create_app(db_path=os.environ.get('POSTGRES_PATH')):
    app = Flask(__name__, static_url_path='', template_folder=os.path.abspath(
        './build'), static_folder=os.path.abspath('./build'))
    if os.environ.get('FLASK_ENV') == 'development':
        CORS(app)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_POOL_TIMEOUT'] = 5
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)
    # app.config['MAX_CONTENT_LENGTH'] = 50 * \
    #     1024 * 1024  # 50 MB max request size

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
    from .ta_manager import TaManager
    from .user_manager import UserManager
    from .notifications import ClearUserNotifications, GetUserNotifications, GetEmailPref, SetEmailPref

    api.add_resource(Auth.Login, '/api/login')  # login route
    api.add_resource(Auth.Logout, '/api/logout')  # logout route
    api.add_resource(Auth.OTPLogin, '/api/otp-login')  # logout route
    # check if logged in
    api.add_resource(Auth.IsLoggedIn, '/api/is-logged-in')
    api.add_resource(LtcManager.ApplyForLTC, '/api/apply')  # apply for ltc
    api.add_resource(Auth.GetSignature, '/api/get-signature')  # get signature
    api.add_resource(Auth.UploadSignature,
                     '/api/upload-signature')  # upload signature
    api.add_resource(UserManager.RegisterUser,
                     '/api/admin/register')  # register user
    api.add_resource(UserManager.GetRoleMapping,
                     '/api/admin/getroles')  # upload signature
    api.add_resource(UserManager.GetUsers,
                     '/api/admin/getusers')  # upload signature
    api.add_resource(UserManager.GetDepartments,
                     '/api/admin/getdepartments')  # upload signature
    api.add_resource(UserManager.RegisterUserFromCSV,
                     '/api/admin/register-from-csv')
    api.add_resource(LtcManager.GetLtcFormData,
                     '/api/getformdata')  # get form data
    # get basic form data for display on tables
    api.add_resource(LtcManager.GetLtcFormMetaData, '/api/get-form-meta')
    api.add_resource(LtcManager.GetLtcFormMetaDataForUser,
                     '/api/getmyforms')  # fetch all user forms
    api.add_resource(LtcManager.GetLtcFormAttachments,
                     '/api/getattachments')  # get form attachemnts
    api.add_resource(LtcManager.GetPendingApprovalRequests,
                     '/api/getpendingltc')  # get pending approval requests for stage
    api.add_resource(LtcManager.GetPastApprovalRequests,
                     '/api/getpastltc')  # get past approval requests
    api.add_resource(LtcManager.CommentOnLTC,
                     '/api/comment')  # comment and forward
    api.add_resource(LtcManager.FillStageForm,
                     '/api/fill-stage-form')  # fill stage form
    # get user dashboard notifications
    api.add_resource(GetUserNotifications, '/api/getnotifications')
    # fetch user email notification preferences
    api.add_resource(GetEmailPref, '/api/get-email-pref')
    # set user email notification preferences
    api.add_resource(SetEmailPref, '/api/set-email-pref')
    # clear user dashboard notifications
    api.add_resource(ClearUserNotifications, '/api/clearnotifications')
    api.add_resource(LtcManager.GetEstablishmentReview,
                     '/api/establishment-review')  # get establishment review requests
    api.add_resource(LtcManager.UploadOfficeOrder,
                     '/api/upload-office-order')  # upload LTC office order
    # get office order for ltc
    api.add_resource(LtcManager.GetOfficeOrder, '/api/get-office-order')
    api.add_resource(LtcManager.GetPendingOfficeOrderRequests,
                     '/api/get-pending-office-order-req')  # get pending office order requests
    api.add_resource(LtcManager.GetPendingAdvancePaymentRequests,
                     '/api/get-pending-advance-payments')  # get pending advance payment  requests
    api.add_resource(LtcManager.UpdateAdvancePaymentDetails,
                     '/api/update-advance-payment')  # upload advance payment details
    api.add_resource(LtcManager.ResolveReviewRequest,
                     '/api/resolve-review')  # resolve review requests
    api.add_resource(LtcManager.EditStageForm,
                     '/api/edit-stage-form')  # edit stage form(establishment, accounts)
    api.add_resource(LtcManager.PrintForm, 
                     '/api/print-form')  # return form data for printing to pdf.
    """
    TA form
    """
    # apply for TA
    api.add_resource(TaManager.ApplyForTA, '/api/ta/apply')
    # comment and forward
    api.add_resource(TaManager.CommentOnTA, '/api/ta/comment')
    # fetch form data
    api.add_resource(TaManager.GetTaFormData, '/api/ta/getformdata')
    # fetch attachments
    api.add_resource(TaManager.GetTaFormAttachments, '/api/ta/getattachments')
    # fetch forms for user
    api.add_resource(TaManager.GetTaFormMetaDataForUser, '/api/ta/getmyforms')
    # fetch form meta data
    api.add_resource(TaManager.GetTaFormMetaData, '/api/ta/get-form-meta')
    # fetch pending approval requests
    api.add_resource(TaManager.GetPendingTaApprovalRequests,
                     '/api/ta/pending-requests')
    # fetch past approved applications
    api.add_resource(TaManager.GetPastTaApprovalRequests,
                     '/api/ta/getpastta')
    # fetch approved ltc applications eligible for TA
    api.add_resource(TaManager.GetApprovedLTCForTA,
                     '/api/ta/get-approved-ltc')
    api.add_resource(TaManager.FillTaStageForm,
                     '/api/ta/fill-stage-form')
    # fetch pending office orders
    api.add_resource(TaManager.GetPendingTaOfficeOrderRequests,
                     '/api/ta/pending-office-orders')
    # upload office order
    api.add_resource(TaManager.UploadTaOfficeOrder,
                     '/api/ta/upload-office-order')
    # get office order for ta
    api.add_resource(TaManager.GetTaOfficeOrder,
                     '/api/ta/get-office-order')
    # update TA payment details
    api.add_resource(TaManager.UpdateAccountsPaymentDetails,
                     '/api/ta/upload-payment-details')
    # print TA form
    api.add_resource(TaManager.PrintTaForm,
                     '/api/ta/print-form')

    @jwt.user_identity_loader
    # return email from user object to route
    def user_identity_loader(user: Users):
        return user.email

    @jwt.user_lookup_loader
    # called to fetch user from database on api request
    def user_lookup_callback(_jwt_header, jwt_data):
        email = jwt_data.get('sub', None)
        return Users.query.filter_by(email=email).one_or_none()

    @app.after_request
    def refresh_expiring_jwts(response):  # refresh auth token
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now()
            target_timestamp = datetime.timestamp(now + timedelta(hours=2))
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
