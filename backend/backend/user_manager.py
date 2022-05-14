from datetime import date, datetime
import os
import json
from . import db, filemanager
from flask import jsonify, request, make_response, redirect
from flask_restful import Resource, abort
from .models import Departments, StageUsers, Users, Stages
from .role_manager import check_role, role_required, Permissions
from . import emailmanager


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
                        },
                        'hod': {
                            'name': 'Head of Department',
                        },
                        'staff': {
                            'name': 'General Staff'
                        }
                    }
                }
        result[Permissions.admin] = {
            'name': 'Admin',
            'roles': {
                'admin': {
                    'name': 'Admin'
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
            """
            Send post request to register user
            """
            name = request.form.get('name')
            email = request.form.get('email')
            department = request.form.get('department')
            role = request.form.get('role')

            if None in [name, email, department, role]:
                abort(400, 'invalid request')

            roles = UserManager.generateRoles()
            department_entry = roles[department]
            if not role in department_entry['roles']:
                abort(400, error='Role mapping not valid')

            return {'error': 'Not implemented'}, 500

    class GetRoleMapping(Resource):
        # @role_required(role=Permissions.admin)
        def get(self):
            roles = UserManager.generateRoles()
            return {'role_mapping': roles}

    class EditUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):

            return {'error': 'Not implemented'}, 500

    class DropUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):

            return {'error': 'Not implemented'}, 500

    class GetUsers(Resource):
        @role_required(role=Permissions.admin)
        def get(self):
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
