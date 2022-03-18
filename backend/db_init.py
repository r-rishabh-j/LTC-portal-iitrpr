from backend import create_app
from backend.models import Departments, Users, LTCRequests, EstablishmentLogs, DeanLogs, DepartmentLogs, AuditLogs, AccountsLogs
from backend.models import db
from dotenv import load_dotenv
import os

load_dotenv()

user_list = [
    Users(email='2019csb1286@iitrpr.ac.in',
          name='Rishabh Jain', dept='cse', permission='client'),
    Users(email='admin@email', name='Admin', dept='admin', permission='admin'),
    Users(email='deanfa@email', name='Dean FA',
          dept='deanfa', permission='deanfa'),
    Users(email='registrar@email', name='Registrar',
          dept='registrar', permission='registrar'),
    Users(email='establishment@email', name='Establishment Section',
          dept='establishment', permission='establishment'),
    Users(email='accounts@email', name='Accounts Section',
          dept='accounts', permission='accounts'),
    Users(email='audit@email', name='audit Section',
          dept='audit', permission='audit'),
]

hod_list = [
    Users(email='hod_cse@email', name='HOD CSE',
          dept='cse', permission='dept_head'),
]

app = create_app(db_path=os.environ.get('POSTGRES_PATH'))
with app.app_context() as ctx:
    Departments.__table__.drop(db.engine)
    EstablishmentLogs.__table__.drop(db.engine)
    DeanLogs.__table__.drop(db.engine)
    DepartmentLogs.__table__.drop(db.engine)
    AuditLogs.__table__.drop(db.engine)
    AccountsLogs.__table__.drop(db.engine)
    LTCRequests.__table__.drop(db.engine)
    Users.__table__.drop(db.engine)
    db.create_all(app=app)
    Departments.create_departments_from_list([
        {'name': 'establishment', 'head_id': None, 'is_stage': True, 'full_name':'Establishment Section'},
        {'name': 'registrar', 'head_id': None, 'is_stage': True, 'full_name':'Registrar'},
        {'name': 'accounts', 'head_id': None, 'is_stage': True, 'full_name':'Accounts Section'},
        {'name': 'deanfa', 'head_id': None, 'is_stage': True, 'full_name':'Dean FA'},
        {'name': 'audit', 'head_id': None, 'is_stage': True, 'full_name':'Audit Section'},
        {'name': 'admin', 'head_id': None, 'is_stage': False, 'full_name':'Admin'},
        {'name': 'math', 'head_id': None, 'is_stage': False, 'full_name':'Mathematics Department'},
        {'name': 'cse', 'head_id': None, 'is_stage': False, 'full_name':'Computer Science and Engineering'},
        {'name': 'ee', 'head_id': None, 'is_stage': False, 'full_name':'Electrical Engineering'},
    ])

    for u in user_list:
        db.session.add(u)

    for head in hod_list:
        db.session.add(head)
    db.session.commit()

    for head in hod_list:
        db.session.refresh(head)

    for head in hod_list:
        dept: Departments = Departments.query.get(head.department)
        dept.dept_head = head.id

    db.session.commit()
