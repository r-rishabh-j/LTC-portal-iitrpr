from . import db
from datetime import date, datetime, timedelta
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy.dialects.postgresql import BYTEA
from sqlalchemy import Text
from sqlalchemy import Integer, Numeric
from . import emailmanager


# class Stage:
#     def __init__(self, id, name, department):
#         self.id = id
#         self.name = name
#         self.department = department


class Stages:
    """
    All LTC Application stages
    """
    establishment = 'establishment'
    audit = 'audit'
    accounts = 'accounts'
    registrar = 'registrar'
    deanfa = 'deanfa'
    office_order_pending = 'office_order_pending'
    advance_pending = 'advance_pending'
    approved = 'approved'  # after advance or office order as per condition
    ta_applied = 'ta_applied'
    availed = 'availed'  # after TA
    review = 'review'


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
    email_pref = db.Column(db.Boolean)
    """
    'notifications': {
        [
            {   
                'level': <info, error, warning, success>
                'time': <timestamp as str>,
                'content': <text>
            }
        ],
    }
    """

    def __init__(self, email, name, dept, permission, designation='Faculty', email_pref=False, employee_code=None):
        self.email = email
        self.name = name
        self.department = dept
        self.signature = None
        self.permission = permission
        self.designation = designation
        self.employee_code = employee_code
        self.notifications = {'notifications': []}
        self.email_pref = email_pref

    def __repr__(self) -> str:
        return f'ID:{self.id}, {self.email}, {self.name}'

    def lookUpByEmail(email):
        user = Users.query.filter_by(email=email).one_or_none()
        return user

    def addNotification(self, text, level='info'):
        self.notifications['notifications'].insert(0, {
            'time': f'{datetime.now()}',
            'content': text,
            'level': level
        })
        flag_modified(self, "notifications")
        db.session.merge(self)

    def clearNotifications(self):
        self.notifications['notifications'].clear()
        flag_modified(self, "notifications")
        db.session.merge(self)


class StageUsers(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)
    designation = db.Column(db.String)

    # TODO: Write all possible designations for stage users
    class Designations:
        deanfa = 'Dean FA'
        registrar = 'Registrar'

        establishment_junior_assistant = 'Junior Assistant'
        establishment_junior_superitendent = 'Junior Superintendent'
        establishment_assistant_registrar = 'Assistant Registrar'
        establishment_deputy_registrar = 'Deputy Registrar'

        senior_audit_officer = 'Senior Audit Officer'
        assistant_audit_officer = 'Assistant Audit Officer'

        accounts_junior_accountant = 'Junior Accountant'
        accounts_junior_accounts_officer = 'Junior Accounts Officer'
        accounts_assistant_registrar = 'Assistant Registrar'
        accounts_deputy_registrar = 'Deputy Registrar'

    def __init__(self, user_id, designation) -> None:
        self.user_id = user_id
        self.designation = designation


class UserOTP(db.Model):
    __tablename__ = 'user_otp'
    email = db.Column(db.String, db.ForeignKey(
        'users.email'), primary_key=True)
    otp = db.Column(db.String)
    valid_till = db.Column(db.DateTime  )

    def __init__(self, email, otp) -> None:
        self.email = email
        self.otp = otp
        self.valid_till = datetime.now()+timedelta(minutes=3)


class Measurements(db.Model):
    __tablename__ = 'analytics'

    id = db.Column(Integer, primary_key=True)
    startedAt = db.Column(Numeric)
    endedAt = db.Column(Numeric)
    elapsed = db.Column(Numeric(6, 4))
    method = db.Column(Text)
    args = db.Column(Text)
    kwargs = db.Column(Text)
    name = db.Column(Text)
    context = db.Column(Text)

    def __repr__(self):
        return "<Measurements {}, {}, {}, {}, {}, {}, {}, {}, {}>".format(
            self.id,
            self.startedAt,
            self.endedAt,
            self.elapsed,
            self.method,
            self.args,
            self.kwargs,
            self.name,
            self.context
        )


class EstablishmentLogs(db.Model):
    """
    Establishment section logs for LTC
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
    """
    new -> new review request
    sent_to_user -> sent to user
    reviewed -> reviewed and sent back by user
    resolved -> review resolved
    """
    updated_on = db.Column(db.DateTime)

    class Status:
        new = 'new'
        sent_to_user = 'sent_to_user'
        reviewed_by_user = 'reviewed_by_user'
        resolved = 'resolved'

    def __init__(self, request_id, received_from, message):
        self.request_id = request_id
        self.received_from = received_from
        self.status = self.Status.new
        self.message = message
        self.updated_on = datetime.now()


class AuditLogs(db.Model):
    """
    Audit section logs for LTC
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
    Accounts section logs for LTC
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
    """
    Registrar logs for LTC
    """
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


class AdvanceRequests(db.Model):
    """
    Advance payment requests
    """
    __tablename__ = 'advance_requests'
    advance_id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), unique=True)
    status = db.Column(db.String(50))
    created_on = db.Column(db.DateTime)
    paid_on = db.Column(db.DateTime)
    amount_paid = db.Column(db.String)  # amount paid
    payment_proof = db.Column(BYTEA)  # path to file, optional
    payment_proof_filename = db.Column(db.String)
    comments = db.Column(db.String)  # may contain ref ID, etc

    class Status:
        new = 'new'
        paid = 'paid'

    def __init__(self, request_id):
        self.request_id = request_id
        self.status = self.Status.new
        self.created_on = datetime.now()
        self.paid_on = None
        self.amount_paid = None
        self.comments = None

    def payment(self, amount, comments):
        self.status = self.Status.paid
        self.amount_paid = amount
        self.comments = comments
        self.paid_on = datetime.now()


class DeanLogs(db.Model):
    """
    Dean logs for LTC
    """
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


def get_stage_roles(stage) -> dict:
    # lookup STAGES dict to get the dept level, query table of the department and insert all stage representatives
    stage_users = []
    query = db.session.query(Users, StageUsers).join(
        StageUsers).filter(Users.permission == stage)
    print(query)
    for user, designation in query:
        stage_users.append(user)
    return stage_users


class LTCRequests(db.Model):
    """
    Stores LTC requests
    """
    __tablename__ = 'ltc_requests'
    request_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_on = db.Column(db.DateTime)
    stage = db.Column(db.String)
    """
    stage: 
    -> establishment 
    -> audit
    -> accounts
    -> registrar
    -> deanfa
    -> approved and sent for office order generation
    -> with user(not submitted): None
    -> declined: -1
    """
    is_active = db.Column(db.Boolean)
    form: dict = db.Column(MutableDict.as_mutable(JSON))
    comments: dict = db.Column(MutableDict.as_mutable(JSON))
    """
    comments:{
        "department":[
            {
                "approved": {
                    "u1": null,
                    "u2": null
                },
                "comments": {
                    "u1": null,
                    "u2": null
                }
            }
        ]
    }
    """
    # stores path to attachments
    # attachments: str = db.Column(db.String, nullable=True)

    def __init__(self, user_id: int):
        self.user_id = user_id
        self.created_on = datetime.now()
        self.stage = ''
        self.is_active = True
        self.comments = {}  # nested JSON

    def __repr__(self) -> str:
        return f'ID:{self.request_id}, {self.user_id}, {self.stage}'

    def stage_name_mapper(stage):
        mapper = {
            'establishment': 'Establishment',
            'audit': 'Audit',
            'accounts': 'Accounts',
            'registrar': 'Registrar',
            'deanfa': 'Dean FA',
        }
        return mapper.get(stage, stage)

    def generate_comments_template(self, stage, roles, review=False):
        comments = {
            "approved": {str(role.email): None for role in roles},
            "comments": {str(role.email): None for role in roles},
        }
        if review:
            comments['review'] = True
        return comments

    def addComment(self, user: Users, comment, approval, is_review=False):
        self.comments[user.department][-1]['approved'][user.email] = approval
        self.comments[user.department][-1]['comments'][user.email] = comment
        if is_review:
            self.comments[user.department][-1]['review'] = True
        flag_modified(self, "comments")
        db.session.merge(self)

    def removeLastComment(self, department):
        for user in self.comments[department][-1]['approved']:
            self.comments[department][-1]['approved'][user] = None
            self.comments[department][-1]['comments'][user] = None
        flag_modified(self, "comments")
        db.session.merge(self)

    def forward(self, applicant: Users):
        """
        Forward form to next stage
        """
        current_stage = self.stage
        message = None

        if current_stage == '':
            new_stage = Stages.establishment
            self.stage = new_stage
            assert self.comments.get(new_stage, None) == None
            self.comments[new_stage] = []
            stage_roles = get_stage_roles(new_stage)
            self.comments[new_stage].append(
                self.generate_comments_template(new_stage, stage_roles)
            )

            est_log: EstablishmentLogs = EstablishmentLogs(
                request_id=self.request_id)
            user_dept: Departments = Departments.query.get(
                applicant.department)
            if not user_dept.is_stage:
                # Notify department head
                dept_log: DepartmentLogs = DepartmentLogs(
                    request_id=self.request_id, department=applicant.department)
                hod: Users = Users.query.get(user_dept.dept_head)
                self.comments['department'] = [
                    self.generate_comments_template('department', [hod])
                ]
                db.session.add(dept_log)
            db.session.add(est_log)
            applicant.addNotification(
                f'Your LTC request, ID {self.request_id} has been forwarded to Establishment Section')
            for role in stage_roles:
                role.addNotification(
                    f'LTC request, ID {self.request_id} has been sent for your approval.')
            message = True, {'msg': 'Forwarded to Establishment Section'}
        elif current_stage == Stages.establishment:
            new_stage = Stages.audit
            est_log = EstablishmentLogs.query.get(self.request_id)
            est_log.status = 'forwarded'
            est_log.updated_on = datetime.now()
            self.stage = new_stage
            assert self.comments.get(new_stage, None) == None
            self.comments[new_stage] = []
            stage_roles = get_stage_roles(new_stage)
            self.comments[new_stage].append(
                self.generate_comments_template(new_stage, stage_roles)
            )
            audit_log: AuditLogs = AuditLogs(request_id=self.request_id)
            db.session.add(audit_log)
            applicant.addNotification(
                f'Your LTC request, ID {self.request_id} has been forwarded to Audit Section')
            for role in stage_roles:
                role.addNotification(
                    f'LTC request, ID {self.request_id} has been sent for your approval.')
            message = True, {'msg': 'Forwarded to Audit Section'}
        elif current_stage == Stages.audit:
            new_stage = Stages.accounts
            au_log: AuditLogs = AuditLogs.query.get(self.request_id)
            au_log.status = 'forwarded'
            au_log.updated_on = datetime.now()
            self.stage = new_stage
            assert self.comments.get(new_stage, None) == None
            self.comments[new_stage] = []
            stage_roles = get_stage_roles(new_stage)
            self.comments[new_stage].append(
                self.generate_comments_template(new_stage, stage_roles)
            )
            log: AccountsLogs = AccountsLogs(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your LTC request, ID {self.request_id} has been forwarded to Accounts Section')
            for role in stage_roles:
                role.addNotification(
                    f'LTC request, ID {self.request_id} has been sent for your approval.')
            message = True, {'msg': 'Forwarded to Accounts Section'}
        elif current_stage == Stages.accounts:
            new_stage = Stages.registrar
            ac_log: AccountsLogs = AccountsLogs.query.get(self.request_id)
            ac_log.status = 'forwarded'
            ac_log.updated_on = datetime.now()
            self.stage = new_stage
            assert self.comments.get(new_stage, None) == None
            self.comments[new_stage] = []
            stage_roles = get_stage_roles(new_stage)
            self.comments[new_stage].append(
                self.generate_comments_template(new_stage, stage_roles)
            )
            log: RegistrarLogs = RegistrarLogs(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your LTC request, ID {self.request_id} has been forwarded to Registrar')
            for role in stage_roles:
                role.addNotification(
                    f'LTC request, ID {self.request_id} has been sent for your approval.')
            message = True, {'msg': 'Forwarded to Registrar Section'}
        elif current_stage == Stages.registrar:
            new_stage = Stages.deanfa
            reg_log: RegistrarLogs = RegistrarLogs.query.get(self.request_id)
            reg_log.status = 'forwarded'
            reg_log.updated_on = datetime.now()
            self.stage = new_stage
            assert self.comments.get(new_stage, None) == None
            self.comments[new_stage] = []
            stage_roles = get_stage_roles(new_stage)
            self.comments[new_stage].append(
                self.generate_comments_template(new_stage, stage_roles)
            )
            log: DeanLogs = DeanLogs(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your LTC request, ID {self.request_id} has been forwarded to Dean FA')
            for role in stage_roles:
                role.addNotification(
                    f'LTC request, ID {self.request_id} has been sent for your approval.')
            message = True, {'msg': 'Forwarded to Dean FA Section'}
        elif current_stage == Stages.deanfa:
            dean_log: DeanLogs = DeanLogs.query.get(self.request_id)
            dean_log.status = 'forwarded'
            dean_log.updated_on = datetime.now()
            self.stage = Stages.office_order_pending
            log: LTCApproved = LTCApproved(request_id=self.request_id)
            db.session.add(log)
            applicant.addNotification(
                f'Your LTC request, ID {self.request_id} is now approved, pending office order generation.')
            emailmanager.sendEmail(
                applicant, f'LTC request, ID {self.request_id} is now approved',
                emailmanager.approval_msg % (applicant.name, self.request_id)
            )
            # TODO: send notification to establishment section for office order generation!

            message = True, {'msg': 'LTC Approved'}
        elif current_stage == 'approved':
            message = False, {'msg': 'Already Approved'}
        else:
            message = False, {
                'error': 'Application in review. Cannot be forwarded'}
        flag_modified(self, "comments")
        db.session.merge(self)
        return message

    def decline(self, applicant: Users):
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
        applicant.addNotification(
            f'Your LTC request, ID {self.request_id} has been declined.', level='error')

        emailmanager.sendEmail(applicant, f'LTC Request ID {self.request_id} Declined', emailmanager.decline_msg % (
            applicant.name, self.request_id))

    def review_to_establishment(self, received_from, message):
        """
        send application for review to establishment
        """
        existing_entry: EstablishmentReview = EstablishmentReview.query.get(
            self.request_id)
        if not existing_entry:
            review_est = EstablishmentReview(
                self.request_id, received_from, message)
        else:
            existing_entry.status = EstablishmentReview.Status.new
            existing_entry.message = message
            existing_entry.received_from = received_from
            existing_entry.updated_on = datetime.now()
            pass

        table_ref = Departments.getDeptRequestTableByName(received_from)
        stage_ref = table_ref.query.get(self.request_id)
        stage_ref.status = ApplicationStatus.review
        # self.stage = 'establishment review'
        db.session.add(review_est)

    def review_to_user(self, received_from, message):
        self.stage = Stages.review
        stage_form: EstablishmentLogs = EstablishmentLogs.query.get(
            self.request_id)
        stage_form.status = 'review'

    def send_for_review(self, reviewer: Users, applicant: Users, message):
        if reviewer.department == Stages.establishment:
            """
            If reviewer is establishment, then send back the application to the user.
            """
            self.review_to_user(reviewer.department,  message)
            for key in self.comments[Stages.establishment][-1]['approved']:
                self.comments[Stages.establishment][-1]['approved'][key] = None

            flag_modified(self, "comments")
            db.session.merge(self)

            applicant.addNotification(
                f'Your LTC request, ID {self.request_id} has been sent back for your review.'
                ' Read comments with the form for more information.', level='warning')
        else:
            """
            else, send back the application to the establishment section.
            """
            self.review_to_establishment(reviewer.department, message)
            est_roles = get_stage_roles(Stages.establishment)
            self.comments[Stages.establishment].append(
                self.generate_comments_template(
                    Stages.establishment, est_roles, review=True)
            )

            for key in self.comments[reviewer.department][-1]['approved']:
                self.comments[reviewer.department][-1]['approved'][key] = None

            flag_modified(self, "comments")
            db.session.merge(self)

            for role in est_roles:
                role.addNotification(
                    f'REVIEW: LTC request, ID {self.request_id} has been sent for review from {str(reviewer.department).capitalize()} Section', level='warning')

    def resolve_review_establishment(self, message):
        pass

    def resolve_user_review(self, received_from, message):
        pass


class LTCProofUploads(db.Model):
    """
    Stores LTC uploaded proofs
    """
    __tablename__ = 'ltc_proof_uploads'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
    file = db.Column(BYTEA)
    filename = db.Column(db.String)

    def __init__(self, request_id, file_as_bytea, filename) -> None:
        self.request_id = request_id
        self.file = file_as_bytea
        self.filename = filename


class LTCApproved(db.Model):
    """
    Stores all approved LTC requests
    """
    __tablename__ = 'ltc_approved'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_requests.request_id'), primary_key=True)
    approved_on = db.Column(db.DateTime)  # timestamp of approval
    """
    relative path to office order document
    """
    office_order_created = db.Column(
        db.Boolean, nullable=True)  # path to office order

    def __init__(self, request_id):
        self.request_id = request_id
        self.approved_on = datetime.now()
        self.office_order_created = False


class LTCOfficeOrders(db.Model):
    """
    Stores LTC office orders for approved requests
    """
    __tablename__ = 'ltc_office_orders'
    request_id = db.Column(db.Integer, db.ForeignKey(
        'ltc_approved.request_id'), primary_key=True)
    file = db.Column(BYTEA)
    filename = db.Column(db.String)

    def __init__(self, request_id, file_as_bytea, filename) -> None:
        self.request_id = request_id
        self.file = file_as_bytea
        self.filename = filename
