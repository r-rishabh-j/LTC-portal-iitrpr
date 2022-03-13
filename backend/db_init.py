from backend import create_app
from backend.models import Departments, Users, LTCRequests
from backend.models import db
from dotenv import load_dotenv
import os

load_dotenv()

user_list = [
    Users(email='2019csb1286@iitrpr.ac.in', name='Rishabh Jain', dept='cse', permission='client'),
    Users(email='admin', name='Admin', dept='admin', permission='admin'),
    Users(email='deanfa', name='Dean FA', dept='deanfa', permission='deanfa'),
    Users(email='registrar', name='Registrar', dept='registrar', permission='registrar'),
    Users(email='establishment', name='Establishment Section', dept='establishment', permission='establishment'),
    Users(email='accounts', name='Accounts Section', dept='accounts', permission='accounts'),
    Users(email='audit', name='audit Section', dept='audit', permission='audit'),
    Users(email='hod_cse', name='HOD CSE', dept='cse', permission='dept_head'),
]

app = create_app(db_path=os.environ.get('POSTGRES_PATH'))
with app.app_context() as ctx:
    Departments.__table__.drop(db.engine)
    LTCRequests.__table__.drop(db.engine)
    Users.__table__.drop(db.engine)
    db.create_all(app=app)
    Departments.create_departments_from_list([
        {'name':'admin', 'head_id': None},
        {'name':'establishment', 'head_id': None},
        {'name':'accounts', 'head_id': None},
        {'name':'registrar', 'head_id': None},
        {'name':'deanfa', 'head_id': None},
        {'name':'audit', 'head_id': None},
        {'name':'cse', 'head_id': None},
        {'name':'ee', 'head_id': None},
        {'name':'math', 'head_id': None},
    ])
    for u in user_list:
        db.session.add(u)
    db.session.commit()