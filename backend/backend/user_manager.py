from datetime import date, datetime
import os
import json
from . import db, filemanager
from flask import jsonify, request, make_response, redirect
from flask_restful import Resource, abort
from .models import Departments, StageUsers, Users, Stages
from .role_manager import check_role, role_required, Permissions
from . import emailmanager
from .analyse import analyse


class UserManager(Resource):

    def generateRoles():
        """
        format
            {
                'cse':{
                    'name': 'Computer Science and Engineering',
                    'roles':{
                        'faculty': {
                            'name': 'Faculty',
                        },
                        'hod': {
                            'name': 'Head of Department',
                        },
                    }
                }
                'establishment':{
                    'name':'Establishment Section',
                    'roles':{
                        'assistant_registrar':{
                            'name':'Assistant Registrar',
                            'isStageRole':True,
                        },
                    }
                }
            }
        """
        result = {}
        non_stage_departments = Departments.query.filter(
            Departments.is_stage != True)

        for dept in non_stage_departments:
            if dept.name != Permissions.admin:
                result[dept.name] = {
                    'name': dept.full_name,
                    'roles': {
                        'faculty': {
                            'name': 'Faculty',
                            'permission': Permissions.client
                        },
                        'hod': {
                            'name': 'Head of Department',
                            'permission': Permissions.dept_head,
                            'isHead': True
                        },
                        'staff': {
                            'name': 'General Staff',
                            'permission': Permissions.client
                        }
                    }
                }
        result[Permissions.admin] = {
            'name': 'Admin',
            'roles': {
                'admin': {
                    'name': 'Admin',
                    'permission': Permissions.admin
                }
            }
        }

        result[Permissions.establishment] = {
            'name': 'Establishment Section',
            'roles': StageUsers.getStageRoles(Stages.establishment),
            'isStage': True
        }
        result[Permissions.audit] = {
            'name': 'Audit Section',
            'roles': StageUsers.getStageRoles(Stages.audit),
            'isStage': True
        }
        result[Permissions.accounts] = {
            'name': 'Accounts Section',
            'roles': StageUsers.getStageRoles(Stages.accounts),
            'isStage': True
        }
        result[Permissions.registrar] = {
            'name': 'Registrar',
            'roles': StageUsers.getStageRoles(Stages.registrar),
            'isStage': True
        }
        result[Permissions.deanfa] = {
            'name': 'DeanFA&A',
            'roles': StageUsers.getStageRoles(Stages.deanfa),
            'isStage': True
        }

        return result

    class RegisterUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):
            analyse()
            """
            Send post request to register user
            """
            user_creds = json.loads(request.form.get('user'))
            print('a', user_creds)
            name = user_creds.get('name')
            email = user_creds.get('email')
            department = user_creds.get('department')
            designation = user_creds.get('designation')
            emp_code = user_creds.get('emp_code')

            if emp_code.isspace() or emp_code == '':
                emp_code = None

            if None in [name, email, department, designation]:
                abort(400, error='invalid request')

            roles = UserManager.generateRoles()
            dept_entry: Departments = Departments.query.get(department)
            if department == None:
                abort(400, error='Invalid Department')
            department_entry = roles[department]
            if not (designation in department_entry['roles']):
                abort(400, error='Role mapping not valid')
            if Users.query.filter_by(email=email).one_or_none() != None:
                abort(400, error='Email Already Exists!')

            if (emp_code != None and not emp_code.isspace() and not emp_code == '') and Users.query.filter_by(employee_code=emp_code).one_or_none() != None:
                abort(400, error='Employee code exists!')

            new_user: Users = Users(email=email, name=name, dept=department, permission=department_entry['roles'][designation]['permission'],
                                    designation=department_entry['roles'][designation]['name'], email_pref=False, employee_code=emp_code)

            db.session.add(new_user)
            db.session.commit()
            db.session.refresh(new_user)

            if department_entry['roles'][designation].get('isStageRole') == True:
                print('yes 111')
                print(department_entry['roles'][designation]['name'])
                stage_user: StageUsers = StageUsers.query.filter(
                    StageUsers.designation == department_entry['roles'][designation]['name']).one_or_none()
                if stage_user == None:
                    stage_user = StageUsers(
                        new_user.id, department_entry['roles'][designation]['name'])
                    db.session.add(stage_user)
                else:
                    stage_user.designation = department_entry['roles'][designation]['name']
                    stage_user.user_id = new_user.id

            if department_entry['roles'][designation].get('isHead') == True:
                print('yes 222')
                dept_entry.dept_head = new_user.id

            db.session.commit()

            return {'success': 'User added'}, 200

    class GetRoleMapping(Resource):
        @role_required(role=Permissions.admin)
        def get(self):
            analyse()
            roles = UserManager.generateRoles()
            return {'role_mapping': roles}

    class EditUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):
            analyse()
            return {'error': 'Not implemented'}, 500

    class DropUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):
            analyse()
            return {'error': 'Not implemented'}, 500

    class GetUsers(Resource):
        @role_required(role=Permissions.admin)
        def get(self):
            analyse()
            # query = db.session.query(Users, Departments).join(Departments).all()
            query = db.session.query(Users, Departments).filter(
                Users.department == Departments.name)
            # users = Users.query.all()
            result = []
            for user, department in query:
                user: Users
                result.append({
                    'user_id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'department': department.full_name,
                    'employee_code': user.employee_code,
                    'designation': user.designation
                }
                )
            return {'users': result}

    class GetDepartments(Resource):

        def get(self):
            analyse()
            query1 = db.session.query(Departments, Users).filter(
                Departments.dept_head == Users.id)
            query2 = Departments.query.filter(Departments.dept_head == None)
            result = []
            for department, user in query1:
                result.append({
                    'dept_id': department.name,
                    'department_name': department.full_name,
                    'head_email': user.email,
                    'is_stage': department.is_stage
                })

            for department in query2:
                result.append({
                    'dept_id': department.name,
                    'department_name': department.full_name,
                    'head_email': 'None',
                    'is_stage': department.is_stage
                })
            return {'departments': result}
