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

    class GetRoleMapping(Resource):
        @role_required(role=Permissions.admin)
        def get(self):
            """
            {
                'cse':{
                    'name': 'Computer Science and Engineering',
                    'roles':{
                        'faculty':'Faculty',
                        'hod': 'Head of Department'
                    }
                }
                'establishment':{
                    'name':'Establishment Section',
                    'roles':{
                        'assistant_registrar':'Assistant Registrar',
                    }
                }
            }
            """
            # stage_departments = Departments.query.filter(
            #     Departments.is_stage == True)
            non_stage_departments = Departments.query.filter(
                Departments.is_stage != True)
            result = {}

            for dept in non_stage_departments:
                if dept.name!=Permissions.admin:
                    result[dept.name] = {
                        'name': dept.full_name,
                        'roles':{
                            'faculty': 'Faculty',
                            'hod': 'Head of Department'
                        }
                    }
            result[Permissions.admin] = {
                'name': 'Admin',
                'roles':{
                    'admin': 'Admin'
                }
            }
            result[Permissions.establishment] = {
                'name': 'Establishment Section',
                'roles':{
                    'junior_assistant': StageUsers.Designations.establishment_junior_assistant,
                    'junior_superitendent': StageUsers.Designations.establishment_junior_superitendent,
                    'assistant_registrar': StageUsers.Designations.establishment_assistant_registrar,
                    'deputy_registrar': StageUsers.Designations.establishment_deputy_registrar,
                }
            }
            result[Permissions.audit] = {
                'name': 'Audit Section',
                'roles':{
                    'senior_audit_officer': StageUsers.Designations.senior_audit_officer,
                    'assistant_audit_officer': StageUsers.Designations.assistant_audit_officer,
                }
            }
            result[Permissions.accounts] = {
                'name': 'Accounts Section',
                'roles':{
                    'junior_accountant': StageUsers.Designations.accounts_junior_accountant,
                    'junior_accounts_officer': StageUsers.Designations.accounts_junior_accounts_officer,
                    'assistant_registrar': StageUsers.Designations.accounts_assistant_registrar,
                }
            }
            result[Permissions.registrar] = {
                'name': 'Registrar',
                'roles':{
                    'registrar': StageUsers.Designations.registrar,
                }
            }
            result[Permissions.deanfa] = {
                'name': 'DeanFA&A',
                'roles':{
                    'deanfa': StageUsers.Designations.deanfa,
                }
            }

            return {'role_mapping': result}


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

            return {'error': 'Not implemented'}, 500

    class EditUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):

            return {'error': 'Not implemented'}, 500

    class DropUser(Resource):
        @role_required(role=Permissions.admin)
        def post(self):

            return {'error': 'Not implemented'}, 500
