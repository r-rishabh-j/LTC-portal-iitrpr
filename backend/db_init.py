from backend import create_app
from backend.models import AccountsTAPayments
from backend.models import DepartmentTALogs
from backend.models import TAOfficeOrders
from backend.models import Departments, Users, LTCRequests, EstablishmentLogs, DeanLogs, DepartmentLogs, \
    AuditLogs, AccountsLogs, LTCApproved, RegistrarLogs, EstablishmentReview, AdvanceRequests, StageUsers,\
    LTCOfficeOrders, LTCProofUploads, AccountsTALogs, AuditTALogs, EstablishmentTALogs, TAApproved, TARequests, UserOTP, TAProofUploads
from backend.models import db
from dotenv import load_dotenv
import os

load_dotenv()

user_list = [
    Users(email='2019csb1286@iitrpr.ac.in',
          name='Rishabh Jain', dept='cse', permission='client', designation='Faculty', employee_code=1, email_pref=True),
    Users(email='2019csb1152@iitrpr.ac.in',
          name='Bhumika', dept='cse', permission='client', designation='Faculty', employee_code=2, email_pref=True),
    Users(email='admin@email', name='Admin', dept='admin',
          permission='admin', designation='Admin'),
    Users(email='ltc.portal.dep@gmail.com', name='Admin', dept='admin',
          permission='admin', designation='Admin'),
]

stage_users_list = [
    {
        'user': Users(email='establishment@email', name='Establishment Section',
                      dept='establishment', permission='establishment', designation='Establishment Section'),
        'designation': StageUsers.Designations.establishment_junior_superitendent
    },
    {
        'user': Users(email='establishment1@email', name='Establishment Section 1',
                      dept='establishment', permission='establishment', designation='Establishment Section'),
        'designation': StageUsers.Designations.establishment_junior_assistant
    },
    {
        'user': Users(email='establishment2@email', name='Establishment Section 2',
                      dept='establishment', permission='establishment', designation='Establishment Section'),
        'designation': StageUsers.Designations.establishment_deputy_registrar
    },
    {
        'user': Users(email='accounts@email', name='Accounts Section',
                      dept='accounts', permission='accounts', designation='Accounts Section'),
        'designation': StageUsers.Designations.accounts_junior_accounts_officer
    },
    {
        'user': Users(email='accounts1@email', name='Accounts Section 1',
                      dept='accounts', permission='accounts', designation='Accounts Section'),
        'designation': StageUsers.Designations.accounts_junior_accountant
    },
    # {
    #     'user': Users(email='accounts2@email', name='Accounts Section 2',
    #                   dept='accounts', permission='accounts', designation='Accounts Section'),
    #     'designation': StageUsers.Designations.accounts_deputy_registrar
    # },
    {
        'user': Users(email='audit@email', name='audit Section',
                      dept='audit', permission='audit', designation='Audit Section'),
        'designation': StageUsers.Designations.assistant_audit_officer
    },
]

hod_cs = Users(email='hod_cse@email', name='HOD CSE',
               dept='cse', permission='dept_head')
hod_list = [
    {
        'user': Users(email='establishment_head@email', name='Establishment Section Head',
                      dept='establishment', permission='establishment', designation='Establishment Section'),
        'designation': StageUsers.Designations.establishment_assistant_registrar
    },
    {
        'user': Users(email='deanfa@email', name='Dean FA',
                      dept='deanfa', permission='deanfa', designation='Dean FA'),
        'designation': StageUsers.Designations.deanfa
    },
    {
        'user': Users(email='registrar@email', name='Registrar',
                      dept='registrar', permission='registrar', designation='Registrar'),
        'designation': StageUsers.Designations.registrar
    },
    {
        'user': Users(email='accounts_head@email', name='Accounts Section',
                      dept='accounts', permission='accounts', designation='Accounts Section Head'),
        'designation': StageUsers.Designations.accounts_assistant_registrar
    },
    {
        'user': Users(email='audit_head@email', name='Audit Section Head',
                      dept='audit', permission='audit', designation='Audit Section'),
        'designation': StageUsers.Designations.senior_audit_officer
    },
]

app = create_app(db_path=os.environ.get('POSTGRES_PATH'))
with app.app_context() as ctx:
    EstablishmentLogs.__table__.drop(db.engine)
    DeanLogs.__table__.drop(db.engine)
    DepartmentLogs.__table__.drop(db.engine)
    AuditLogs.__table__.drop(db.engine)
    AccountsLogs.__table__.drop(db.engine)
    LTCProofUploads.__table__.drop(db.engine)
    LTCOfficeOrders.__table__.drop(db.engine)
    RegistrarLogs.__table__.drop(db.engine)
    EstablishmentReview.__table__.drop(db.engine)
    AdvanceRequests.__table__.drop(db.engine)
    EstablishmentTALogs.__table__.drop(db.engine)
    AuditTALogs.__table__.drop(db.engine)
    AccountsTALogs.__table__.drop(db.engine)
    TAOfficeOrders.__table__.drop(db.engine)
    TAApproved.__table__.drop(db.engine)
    TAProofUploads.__table__.drop(db.engine)
    AccountsTAPayments.__table__.drop(db.engine)
    DepartmentTALogs.__table__.drop(db.engine)
    TARequests.__table__.drop(db.engine)
    LTCApproved.__table__.drop(db.engine)
    LTCRequests.__table__.drop(db.engine)
    StageUsers.__table__.drop(db.engine)
    UserOTP.__table__.drop(db.engine)
    Users.__table__.drop(db.engine)
    Departments.__table__.drop(db.engine)
    db.create_all(app=app)
    Departments.create_departments_from_list([
        {'name': 'establishment', 'head_id': None,
            'is_stage': True, 'full_name': 'Establishment Section'},
        {'name': 'registrar', 'head_id': None,
            'is_stage': True, 'full_name': 'Registrar'},
        {'name': 'accounts', 'head_id': None,
            'is_stage': True, 'full_name': 'Accounts Section'},
        {'name': 'deanfa', 'head_id': None,
            'is_stage': True, 'full_name': 'Dean FA'},
        {'name': 'audit', 'head_id': None,
            'is_stage': True, 'full_name': 'Audit Section'},
        {'name': 'admin', 'head_id': None, 'is_stage': False, 'full_name': 'Admin'},
        {'name': 'math', 'head_id': None, 'is_stage': False,
            'full_name': 'Mathematics Department'},
        {'name': 'cse', 'head_id': None, 'is_stage': False,
            'full_name': 'Computer Science and Engineering'},
        {'name': 'ee', 'head_id': None, 'is_stage': False,
            'full_name': 'Electrical Engineering'},
    ])

    for u in user_list:
        db.session.add(u)

    for u in stage_users_list:
        db.session.add(u['user'])

    for head in hod_list:
        db.session.add(head['user'])
    db.session.add(hod_cs)
    db.session.commit()

    for head in hod_list:
        db.session.refresh(head['user'])

    for user in stage_users_list:
        db.session.refresh(user['user'])
        stage_user = StageUsers(user['user'].id, user['designation'])
        db.session.add(stage_user)

    db.session.refresh(hod_cs)
    dept: Departments = Departments.query.get(hod_cs.department)
    dept.dept_head = hod_cs.id

    for head in hod_list:
        dept: Departments = Departments.query.get(head['user'].department)
        dept.dept_head = head['user'].id
        stage_user = StageUsers(head['user'].id, head['designation'])
        db.session.add(stage_user)

    db.session.commit()
