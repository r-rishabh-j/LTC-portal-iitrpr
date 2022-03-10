from dataclasses import dataclass
from . import db
from datetime import datetime
# from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.mutable import MutableDict


class Stages:
    STAGES = {
        "department": 0,
        "establishment": 1,
        "audit": 2,
        "accounts": 3,
        "registrar": 4,
        "deanfa": 5,
        "approved": 6,
    }

    HIGHEST_STAGE = STAGES['deanfa']


def get_stage_roles(stage) -> dict:
    # lookup STAGES dict to get the dept level, query table of the department and insert all stage representatives
    return dict()


"""
To be used to indicate status of application in logs tables
"""


class ApplicationStatus:
    new = 'new'  # a new LTC request
    review = 'review'  # application sent back for review
    forwarded = 'forwarded'  # application forwarded
    # application processed(approved or denied anywhere in the heirarchy)
    complete = 'complete'


# class UserCredentials(db.Model):
#     __tablename__ = 'user_credentials'
#     email = db.Column(db.String(150), primary_key=True)
#     password = db.Column(db.String(250), nullable=False)

#     def __init__(self, email, password):
#         self.email = email
#         self.password = password
# class Admin(db.Model):


class Permissions(db.Model):
    __tablename__ = 'user_credentials'
    permission = db.Column(db.Integer, primary_key=True)

# TODO: decide permission column, id values


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    # name for higher level employees to be their designation
    name = db.Column(db.String(150), nullable=False)
    department = db.Column(db.String(150), nullable=False)
    permission = db.Column(db.Integer, nullable=False)
    signature = db.Column(db.String, nullable=True)
    picture = db.Column(db.String, nullable=True)
    # signature = db.Column(db.String(300), nullable=True)

    def __init__(self, email, name, dept):
        self.email = email
        self.name = name
        self.department = dept
        self.signature = None


"""
This creates next stage comment fields in the comment column onlt at the time of forward
"""


class LTCRequests(db.Model):
    __tablename__ = 'ltc_requests'
    request_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    # user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_on = db.Column(db.DateTime)
    stage = db.Column(db.Integer)
    """
    stage: int
    -> est: 1
    -> audit: 2
    -> accounts: 3
    -> registrar: 4
    -> deanfa: 5
    -> approved and sent for office order generation: 6
    ->with user(not submitted): None
    -> declined: -1
    """
    is_active = db.Column(db.Boolean)
    form = db.Column(MutableDict.as_mutable(JSON))
    # will store comments from every section in a JSON file
    comments = db.Column(MutableDict.as_mutable(JSON))
    # nested JSON, contains comments from every section

    def __init__(self, user_id: int, stage: int = None, comments: dict = None):
        self.user_id = user_id
        self.created_on = datetime.now()
        self.stage = stage
        self.is_active = True
        self.comments = comments  # nested JSON

    def generate_comments_template(stage):
        if stage not in Stages.STAGES:
            return None
        comments = {
            "approved": get_stage_roles(stage),
            "comments": get_stage_roles(stage),
            "signature": get_stage_roles(stage),
        }
        return comments


class LTCApproved(db.Model):
    """
    Stores all approved LTC requests and office order
    """
    __tablename__ = 'ltc_approved'
    request_id = db.Column(db.Integer, primary_key=True)
    approved_on = db.Column(db.DateTime)  # timestamp of approval
    """
    relative path to office order document
    """
    office_order = None  # path to office order

    def __init__(self, request_id):
        self.request_id = request_id
        self.approved_on = datetime.now()
        self.office_order = None


class EstablishmentLogs(db.Model):
    """
    Establishment section logs
    """
    __tablename__ = 'establishment_logs'
    request_id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))
    """
    status: String
    -> 'new': a new LTC request
    -> 'review': application sent back for review
    -> 'forwarded': application forwarded
    -> 'complete': application processed(approved or denied anywhere in the heirarchy)
    """
    updated_on = db.Column(db.DateTime)

    def __init__(self, request_id):
        self.request_id = request_id
        self.status = ApplicationStatus.new
        self.updated_on = datetime.now()


class AuditLogs(db.Model):
    """
    Audit section logs
    """
    __tablename__ = 'audit_logs'
    request_id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))
    """
    status: String
    -> 'new': a new LTC request
    -> 'review': application sent back for review
    -> 'forwarded': application forwarded
    -> 'complete': application processed(approved or denied anywhere in the heirarchy)
    """
    updated_on = db.Column(db.DateTime)

    def __init__(self, request_id):
        self.request_id = request_id
        self.status = ApplicationStatus.new
        self.updated_on = datetime.now()


class AccountsLogs(db.Model):
    """
    Accounts section logs
    """
    __tablename__ = 'accounts_logs'
    request_id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))
    """
    status: String
    -> 'new': a new LTC request
    -> 'review': application sent back for review
    -> 'forwarded': application forwarded
    -> 'complete': application processed(approved or denied anywhere in the heirarchy)
    """
    updated_on = db.Column(db.DateTime)

    def __init__(self, request_id):
        self.request_id = request_id
        self.status = ApplicationStatus.new
        self.updated_on = datetime.now()


class RegistrarLogs(db.Model):
    __tablename__ = 'registrar_logs'
    request_id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))
    """
    status: String
    -> 'new': a new LTC request
    -> 'review': application sent back for review
    -> 'forwarded': application forwarded
    -> 'complete': application processed(approved or denied anywhere in the heirarchy)
    """
    updated_on = db.Column(db.DateTime)

    def __init__(self, request_id):
        self.request_id = request_id
        self.status = ApplicationStatus.new
        self.updated_on = datetime.now()


class DeanLogs(db.Model):
    __tablename__ = 'dean_logs'
    request_id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))
    """
    status: String
    -> 'new': a new LTC request
    -> 'review': application sent back for review
    -> 'forwarded': application forwarded
    -> 'complete': application processed(approved or denied anywhere in the heirarchy)
    """
    updated_on = db.Column(db.DateTime)

    def __init__(self, request_id):
        self.request_id = request_id
        self.status = ApplicationStatus.new
        self.updated_on = datetime.now()


class Departments(db.Model):
    """
    Table stores department list
    """
    __tablename__ = 'departments'
    name = db.Column(db.String(20), primary_key=True)
    dept_head = db.Column(db.Integer)  # userID of the department head

    def __init__(self, name, dept_head=None):
        self.name = name
        self.dept_head = dept_head


class DepartmentLogs(db.Model):
    """
    Stores HOD and department head logs
    """
    __tablename__ = 'department_logs'
    request_id = db.Column(db.Integer, primary_key=True)
    department = db.Column(db.String(20))
    status = db.Column(db.String(50))
    """
    status: String
    -> 'new': a new LTC request
    -> 'review': application sent back for review
    -> 'forwarded': application forwarded
    -> 'complete': application processed(approved or denied anywhere in the heirarchy)
    """
    updated_on = db.Column(db.DateTime)

    def __init__(self, request_id):
        self.request_id = request_id
        self.status = ApplicationStatus.new
        self.updated_on = datetime.now()


class test_table(db.Model):
    __tabelname__ = 'test_table'
    id = db.Column(db.Integer, primary_key=True)
    json_col = db.Column(MutableDict.as_mutable(JSON))
    time = db.Column(db.DateTime)

    def __init__(self, json_col):
        self.json_col = json_col
        self.time = datetime.now()
