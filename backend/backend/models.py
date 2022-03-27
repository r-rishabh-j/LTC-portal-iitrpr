from . import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm.attributes import flag_modified


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
            'role': 'establishment'
        },
        {
            'id': 'audit',
            'name': 'Audit Section Approval Pending',
            'department': 'audit',
            'role': 'audit'
        },
        {
            'id': 'accounts',
            'name': 'Accounts Section Approval Pending',
            'department': 'accounts',
            'role': 'accounts'
        },
        {
            'id': 'registar',
            'name': 'Registrar Approval Pending',
            'department': 'registrar',
            'role': 'registrar'
        },
        {
            'id': 'deanfa',
            'name': 'Dean FA Approval Pending',
            'department': 'deanfa',
            'role': 'deanfa'
        },
        {
            'id': 'office_order_pending',
            'name': 'Approved, office order pending',
            'approval_status': True,
            'department': 'establishment',
            'role': 'establishment',
        },
        {
            'id': 'office_order_generated',
            'name': 'Approved, office order generated',
            'approval_status': True,
            'department': 'establishment',
            'role': 'establishment',
        }, ]

    ADVANCE_PAYMENT_STAGES = [
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


class ApplicationStatus:
    """
    To be used to indicate status of application in logs tables
    """
    new = 'new'  # a new LTC request
    review = 'review'  # application sent back for review
    forwarded = 'forwarded'  # application forwarded
    # application processed(approved or denied anywhere in the heirarchy)
    complete = 'complete'


class Users(db.Model):
    """
    Users table
    Admin needs to add users to the table so that users can login.
    Users cannot register themselves.
    """
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    employee_code = db.Column(db.Integer, unique=True)  # optional
    # name for higher level employees to be their designation
    name = db.Column(db.String(150), nullable=False)
    department = db.Column(db.String(150), db.ForeignKey('departments.name'))
    # permission level. Defined in role_manager.
    permission = db.Column(db.String, nullable=False)
    designation = db.Column(db.String, nullable=False)  # designation. Custom
    signature = db.Column(db.String, nullable=True)  # stores signature
    picture = db.Column(db.String, nullable=True)  # picture from google auth
    # stores user notifications
    notifications = db.Column(MutableDict.as_mutable(JSON))
    """
    [
        {
            'time': <timestamp as str>,
            'content': <text>
        }
    ]
    """

    def __init__(self, email, name, dept, permission, designation='Faculty', employee_code=None):
        self.email = email
        self.name = name
        self.department = dept
        self.signature = None
        self.permission = permission
        self.designation = designation
        self.employee_code = employee_code
        self.notifications = {'notifications': []}

    def __repr__(self) -> str:
        return f'ID:{self.id}, {self.email}, {self.name}'

    def lookUpByEmail(email):
        user = Users.query.filter_by(email=email).one_or_none()
        return user

    def addNotification(self, text):
        notifs = self.notifications['notifications']
        notifs.insert(0, {
            'time': f'{datetime.today().date()}',
            'content': text
        })
        self.notifications['notifications'] = notifs
        flag_modified(self, "notifications")
        db.session.merge(self)

    def clearNotifications(self):
        self.notifications['notifications'].clear()
        flag_modified(self, "notifications")
        db.session.merge(self)


"""
This creates next stage comment fields in the comment column onlt at the time of forward
"""


class EstablishmentLogs(db.Model):
    """
    Establishment section logs
    """
    __tablename__ = 'establishment_logs'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
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


class EstablishmentReview(db.Model):
    """
    Establishment section review table
    """
    __tablename__ = 'establishment_review'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
    received_from = db.Column(db.String, db.ForeignKey('departments.name'))
    message = db.Column(db.String)
    status = db.Column(db.String(50))
    updated_on = db.Column(db.DateTime)

    def __init__(self, request_id, received_from, message):
        self.request_id = request_id
        self.received_from = received_from
        self.message = message
        self.updated_on = datetime.now()


class AuditLogs(db.Model):
    """
    Audit section logs
    """
    __tablename__ = 'audit_logs'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
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
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
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
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
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
    __tablename__ = 'deanfa_logs'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True, )
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
    # whether the dept belongs to a stage in the heirarchy
    is_stage = db.Column(db.Boolean)
    full_name = db.Column(db.String)

    def __init__(self, name, is_stage, full_name, dept_head=None):
        self.name = name
        self.is_stage = is_stage
        self.full_name = full_name
        self.dept_head = dept_head

    def __repr__(self) -> str:
        return f'{self.name}, {self.full_name}, Stage: {self.is_stage}'

    def create_departments_from_list(dept_list):
        for dept in dept_list:
            d = Departments(
                name=dept['name'], is_stage=dept['is_stage'], full_name=dept['full_name'], dept_head=dept['head_id'])
            db.session.add(d)

    def getDeptRequestTableByName(dept_name):
        dept_name = dept_name+'_logs'
        for table in db.Model.registry._class_registry.values():
            if hasattr(table, '__tablename__'):
                name = table.__tablename__
                if name == dept_name:
                    return table
        return None


class DepartmentLogs(db.Model):
    """
    Stores HOD and department head logs
    """
    __tablename__ = 'department_logs'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
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

    def __init__(self, request_id, department):
        self.request_id = request_id
        self.department = department
        self.status = ApplicationStatus.new
        self.updated_on = datetime.now()


def get_stage_roles(department) -> dict:
    # lookup STAGES dict to get the dept level, query table of the department and insert all stage representatives
    stage_users = Users.query.filter_by(department=department)
    users = {}
    for user in stage_users:
        users[user.email] = None
    return users


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

    def __init__(self, user_id: int):
        self.user_id = user_id
        self.created_on = datetime.now()
        self.stage = ''
        self.is_active = True
        self.comments = {'comments': []}  # nested JSON

    def __repr__(self) -> str:
        return f'ID:{self.request_id}, {self.user_id}, {self.stage}'

    def generate_comments_template(self, dept):
        comments = {
            "approved": get_stage_roles(dept),
            "comments": get_stage_roles(dept),
        }
        return comments

    STAGES = [
        {
            'id': 'establishment',
            'name': 'Establishment Section Approval Pending',
            'department': 'establishment',
            'role': 'establishment',
            'table': EstablishmentLogs
        },
        {
            'id': 'audit',
            'name': 'Audit Section Approval Pending',
            'department': 'audit',
            'role': 'audit',
            'table': AuditLogs
        },
        {
            'id': 'accounts',
            'name': 'Accounts Section Approval Pending',
            'department': 'accounts',
            'role': 'accounts',
            'table': AccountsLogs
        },
        {
            'id': 'registar',
            'name': 'Registrar Approval Pending',
            'department': 'registrar',
            'role': 'registrar',
            'table': RegistrarLogs
        },
        {
            'id': 'deanfa',
            'name': 'Dean FA Approval Pending',
            'department': 'deanfa',
            'role': 'deanfa',
            'table': DeanLogs
        },
        {
            'id': 'office_order_pending',
            'name': 'Approved, office order pending',
            'approval_status': True,
            'department': 'establishment',
            'role': 'establishment',
        },
        {
            'id': 'office_order_generated',
            'name': 'Approved, office order generated',
            'approval_status': True,
            'department': 'establishment',
            'role': 'establishment',
        },
        {
            'id': 'advance_pending',
            'name': 'Advance sum pending',
            'approval_status': True,
            'advance_payment_stage': False,
            'department': 'accounts'
        },
        {
            'id': 'advance_paid',
            'name': 'Advance sum issued',
            'approval_status': True,
            'advance_payment_stage': False,
            'department': 'accounts',
        },
    ]

    def addComment(self, department, user, comment, approval):
        self.comments['comments'][-1][department]['approved'][user.email] = approval
        self.comments['comments'][-1][department]['comments'][user.email] = comment

    def forward(self, applicant: Users):
        """
        Forward form to next stage
        """
        current_stage = self.stage
        message = None

        if current_stage == '':
            self.stage = 'establishment'
            self.comments['comments'].append({
                'establishment': self.generate_comments_template('establishment')
            })
            est_log: EstablishmentLogs = EstablishmentLogs(
                request_id=self.request_id)
            user_dept: Departments = Departments.query.get(
                applicant.department)
            if not user_dept.is_stage:
                # add dept comments
                dept_log: DepartmentLogs = DepartmentLogs(
                    request_id=self.request_id, department=applicant.department)
                db.session.add(dept_log)
            db.session.add(est_log)
            applicant.addNotification(
                f'Your request {self.request_id} forwarded to Establishment Section')
            message = True, {'msg': 'Forwarded to Establishment Section'}
        elif current_stage == 'establishment':
            est_log = EstablishmentLogs.query.get(self.request_id)
            est_log.status = 'forwarded'
            est_log.updated_on = datetime.now()
            self.stage = 'audit'
            self.comments['comments'].append({
                'audit': self.generate_comments_template('audit')
            })
            audit_log: AuditLogs = AuditLogs(request_id=self.request_id)
            db.session.add(audit_log)
            applicant.addNotification(
                f'Your request {self.request_id} forwarded to Audit Section')
            message = True, {'msg': 'Forwarded to Audit Section'}
        elif current_stage == 'audit':
            au_log: AuditLogs = AuditLogs.query.get(self.request_id)
            au_log.status = 'forwarded'
            au_log.updated_on = datetime.now()
            self.stage = 'accounts'
            self.comments['comments'].append({
                'accounts': self.generate_comments_template('accounts')
            })
            log: AccountsLogs = AccountsLogs(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your request {self.request_id} forwarded to Accounts Section')
            message = True, {'msg': 'Forwarded to Accounts Section'}
        elif current_stage == 'accounts':
            ac_log: AccountsLogs = AccountsLogs.query.get(self.request_id)
            ac_log.status = 'forwarded'
            ac_log.updated_on = datetime.now()
            self.stage = 'registrar'
            self.comments['comments'].append({
                'registrar': self.generate_comments_template('registrar')
            })
            log: RegistrarLogs = RegistrarLogs(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your request {self.request_id} forwarded to Registrar')
            message = True, {'msg': 'Forwarded to Registrar Section'}
        elif current_stage == 'registrar':
            reg_log: RegistrarLogs = RegistrarLogs.query.get(self.request_id)
            reg_log.status = 'forwarded'
            reg_log.updated_on = datetime.now()
            self.stage = 'deanfa'
            self.comments['comments'].append({
                'deanfa': self.generate_comments_template('deanfa')
            })
            self.comments['deanfa'] = self.generate_comments_template('deanfa')
            log: DeanLogs = DeanLogs(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your request {self.request_id} forwarded to Dean FA')
            message = True, {'msg': 'Forwarded to Dean FA Section'}
        elif current_stage == 'deanfa':
            dean_log: DeanLogs = DeanLogs.query.get(self.request_id)
            dean_log.status = 'forwarded'
            dean_log.updated_on = datetime.now()
            self.stage = 'approved'
            log: LTCApproved = LTCApproved(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your request {self.request_id} is now approved!')
            message = True, {'msg': 'LTC Approved'}
        elif current_stage == 'approved':
            message = False, {'msg': 'Already Approved'}
        else:
            message = False, {
                'error': 'Application in review. Cannot be forwarded'}
        flag_modified(self, "comments")
        db.session.merge(self)
        return message

    def decline(self, applicant):
        self.stage = 'declined'
        stages = [
            'department',
            'establishment',
            'audit',
            'accounts',
            'registrar',
            'deanfa',
        ]

        for stage in stages:
            table_ref = Departments.getDeptRequestTableByName(stage)
            if not table_ref:
                print('table not found')
                break
            form = table_ref.query.get(self.request_id)
            if not form:
                break
            form.status = 'declined'

    def review_to_establishment(self, received_from, message):
        """
        send application for review to establishment
        """
        review_est = EstablishmentReview(
            self.request_id, received_from, message)
        table_ref = Departments.getDeptRequestTableByName(received_from)
        stage_ref = table_ref.query.get(self.request_id)
        stage_ref.status = 'review'
        # self.stage = 'establishment review'
        db.session.add(review_est)

    def resolve_review_establishment(self, message):
        pass

    def review_to_user(self, received_from, message):
        self.stage = 'review'

    def resolve_user_review(self, received_from, message):
        pass


class LTCApproved(db.Model):
    """
    Stores all approved LTC requests and office order
    """
    __tablename__ = 'ltc_approved'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
    approved_on = db.Column(db.DateTime)  # timestamp of approval
    """
    relative path to office order document
    """
    office_order = db.Column(db.String, nullable=True)  # path to office order

    def __init__(self, request_id):
        self.request_id = request_id
        self.approved_on = datetime.now()
        self.office_order = None
