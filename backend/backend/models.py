from dataclasses import dataclass
from . import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.mutable import MutableDict


class Stage:
    def __init__(self, id, name, department):
        self.id = id
        self.name = name
        self.department = department


class Stages:
    # ordered list of heirarchy
    STAGES = [
        # {
        #     'id': 'department',
        #     'name': 'Department',
        #     'department': 'department'
        # },
        {
            'id': 'establishment',
            'name': 'Establishment Section Approval Pending',
            'department': 'establishment',
        },
        {
            'id': 'audit',
            'name': 'Audit Section Approval Pending',
            'department': 'audit'
        },
        {
            'id': 'accounts',
            'name': 'Accounts Section Approval Pending',
            'department': 'accounts'
        },
        {
            'id': 'registar',
            'name': 'Registrar Approval Pending',
            'department': 'registrar'
        },
        {
            'id': 'deanfa',
            'name': 'Dean FA Approval Pending',
            'department': 'deanfa'
        },
        {
            'id': 'office_order_pending',
            'name': 'Approved, office order pending',
            'approval_status': True,
            'department': 'establishment'
        },
        {
            'id': 'office_order_generated',
            'name': 'Approved, office order generated',
            'approval_status': True,
            'department': 'establishment'
        },
        {
            'id': 'advance_pending',
            'name': 'Advance sum pending',
            'approval_status': True,
            'department': 'accounts'
        },
        {
            'id': 'advance_paid',
            'name': 'Advance sum issued',
            'approval_status': True,
            'department': 'accounts'
        },
    ]

    def getStageIndex(current_stage):
        for stage in Stages.STAGES:
            if stage['id'] == current_stage:
                return stage
        return None

    def getNextStage(current_stage: str):
        stage_id = Stages.getStageIndex(current_stage)
        if not stage_id:
            return None
        next_stage = None if (
            stage_id+1) >= len(Stages.STAGES) else Stages.STAGES[stage_id+1]
        return next_stage

    def firstStage():
        return Stages.STAGES[0]


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
    permission = db.Column(db.String, nullable=False)
    signature = db.Column(db.String, nullable=True)
    picture = db.Column(db.String, nullable=True)
    # signature = db.Column(db.String(300), nullable=True)

    def __init__(self, email, name, dept, permission):
        self.email = email
        self.name = name
        self.department = dept
        self.signature = None
        self.permission = permission

    def lookUpByEmail(email):
        user = Users.query.filter_by(email=email).one_or_none()
        return user


"""
This creates next stage comment fields in the comment column onlt at the time of forward
"""


class LTCRequests(db.Model):
    __tablename__ = 'ltc_requests'
    request_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_on = db.Column(db.DateTime)
    stage = db.Column(db.String)
    """
    stage: int
    -> establishment: 1
    -> audit: 2
    -> accounts: 3
    -> registrar: 4
    -> deanfa: 5
    -> approved and sent for office order generation: 6
    -> with user(not submitted): None
    -> declined: -1
    """
    is_active = db.Column(db.Boolean)
    form: dict = db.Column(MutableDict.as_mutable(JSON))
    comments: dict = db.Column(MutableDict.as_mutable(JSON))
    # stores path to attachments
    attachments: str = db.Column(db.String, nullable=True)

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

    def create_departments_from_list(dept_list):
        for dept in dept_list:
            d = Departments(name=dept['name'], dept_head=dept['head_id'])
            db.session.add(d)
    

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
