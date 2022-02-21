from . import db
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.mutable import MutableDict

STAGES = {
    "with-user": None,
    "department": 0,
    "establishment": 1,
    "audit": 2,
    "accounts": 3,
    "registrar": 4,
    "deanfa": 5,
    "approved": 6,
    "declined": -1,
}


def get_stage_roles(stage) -> dict:
    # lookup STAGES dict to get the dept level, query table of the department and insert all stage representatives
    return dict()


class UserCredentials(db.Model):
    __tablename__ = 'user_credentials'
    email = db.Column(db.String(150), db.ForeignKey(
        'users.email'), primary_key=True)
    password = db.Column(db.String(250), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = password


class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    # name for higher level employees to be their designation
    name = db.Column(db.String(150), nullable=False)
    department = db.Column(db.String(150), nullable=False)
    permission = db.Column(db.Integer, nullable=False)
    # signature = db.Column(db.String(300), nullable=True)

    def __init__(self, email, name, dept):
        self.email = email
        self.name = name
        self.department = dept


"""Design 1"""
# class LTCRequests(db.Model):
#     __tablename__ = 'ltc_requests'
#     request_id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     created_on = db.Column(db.DateTime)
#     status = db.Column(db.String(20))  # in-review, declined, approved-> -1,
#     form = db.Column(MutableDict.as_mutable(JSON))
#     # will store comments from every section in a JSON file
#     comments = db.Column(MutableDict.as_mutable(JSON))
#     # nested JSON, contains comments from every section

#     def __init__(self, user_id):
#         self.user_id = user_id
#         self.created_on = datetime.now()
#         self.status = 'in-review'
#         self.comments = self.generate_comments_template()

#     def generate_comments_template():
#         comments = dict()
#         for stage in STAGES:
#             comments[stage] = {
#                 "approved": get_stage_roles(),
#                 "comments": get_stage_roles(),
#                 "signature": get_stage_roles()
#             }
#         return comments


class LTCRequests(db.Model):
    __tablename__ = 'ltc_requests'
    request_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_on = db.Column(db.DateTime)
    """
    stage:
    1-> est
    2-> audit
    3-> accounts
    4-> registrar
    5-> deanfa
    6-> approved and sent for office order generation
    -1-> declined
    None->with user
    """
    stage = db.Column(db.Integer)
    form = db.Column(MutableDict.as_mutable(JSON))
    # will store comments from every section in a JSON file
    comments = db.Column(MutableDict.as_mutable(JSON))
    # nested JSON, contains comments from every section

    def __init__(self, user_id, stage=None, comments=None):
        self.user_id = user_id
        self.created_on = datetime.now()
        self.stage = stage
        self.comments = comments  # nested JSON

    def generate_comments_template(stage):
        if stage not in STAGES:
            return None
        comments = {
            "approved": get_stage_roles(stage),
            "comments": get_stage_roles(stage),
            "signature": get_stage_roles(stage),
        }
        return comments

class LTCApproved(db.Model):
    __tablename__ = 'ltc_approved'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
    approved_on = db.Column(db.DateTime)

    def __init__(self, request_id):
        self.request_id = request_id
        self.approved_on = datetime.now()


class test_table(db.Model):
    __tabelname__ = 'test_table'
    id = db.Column(db.Integer, primary_key=True)
    json_col = db.Column(MutableDict.as_mutable(JSON))
    time = db.Column(db.DateTime)

    def __init__(self, json_col):
        self.json_col = json_col
        self.time = datetime.now()


# class LtcRequests(db.Model):
#     requestID = db.Column(db.Integer, primary_key=True)
#     userID = db.Column(db.Integer, db.ForeignKey('users.id'))
#     status = db.Column(db.String(20)) # inReview, declined, approved
#     comments = db.Column(JSON) # nested JSON, contains comments from every section


# class LtcRequestsApproved(db.Model):
#     requestID = db.Column(db.Integer, db.ForeignKey('LtcRequests.requestID'))
#     metaData = db.Column(JSON)


# class HODLtcRequest(db.Model):
#     requestID = db.Column(db.Integer, db.ForeignKey('LtcRequests.requestID'))
#     pass

# class EstablishmentLtcRequests(db.Model):
#     pass

# class AccountsLtcRequests(db.Model):
#     pass

# class TaRequestsPending(db.Model):
#     pass
