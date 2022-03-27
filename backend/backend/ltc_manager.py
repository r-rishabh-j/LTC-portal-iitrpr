import os
import json
from . import db
from . import filemanager
from flask import jsonify, request, make_response, send_file
from flask_restful import Resource, reqparse, abort, fields
from sqlalchemy.orm.attributes import flag_modified
from flask_jwt_extended import current_user
from .role_manager import role_required, roles_required, check_role
from .models import Users, LTCRequests, Departments
from markupsafe import escape


class ApplyForLTC(Resource):
    """
    Puts the request in LTCRequests, DepartmentLogs and Establishment Logs
    """

    def initialiseApplication(self, new_request: LTCRequests, current_user: Users):
        """
        Initialise a new application.
        """
        db.session.add(new_request)
        db.session.commit()
        db.session.refresh(new_request)
        new_request.forward(current_user)
        flag_modified(new_request, "comments")
        db.session.merge(new_request)

    @role_required('client')
    def post(self):
        # gets file tagged with name attachments
        user: Users = current_user
        file = request.files.get('attachments')
        # get form data
        form_data = json.loads(request.form.get('form'))
        filepath = None
        # save file at filepath
        if file != None:
            filepath = filemanager.saveFile(file, user.id)
        print(form_data)
        # remove key attachments (which is redudant) from form json
        form_data.pop('attachments')
        # add LTC request to table
        new_request: LTCRequests = LTCRequests(user_id=user.id)
        new_request.form, new_request.attachments = form_data, filepath
        # initialise the application
        self.initialiseApplication(new_request, user)
        db.session.commit()
        return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)


class FillStageForm(Resource):
    allowed_roles = [
        'establishment',
        'accounts',
    ]

    @roles_required(roles=allowed_roles)
    def post(self, permission):
        request_id = request.json['request_id']
        if not request_id:
            abort(404, msg='Request ID not sent')

        content = request.json.get('stage_form', None)
        if not content:
            abort(404, msg='No form content sent!')

        form: LTCRequests = LTCRequests.query.get(int(request_id))

        if not form:
            abort(404, msg="Invalid Request ID")

        form.form[permission] = content
        flag_modified(form, "form")
        db.session.merge(form)
        db.session.commit()
        return jsonify({"msg": "updated!"})


class CommentOnLTC(Resource):
    allowed_roles = [
        'deanfa',
        'registrar',
        'establishment',
        'accounts',
        'audit',
    ]

    @roles_required(roles=allowed_roles)
    def post(self, **kwargs):
        # post request ID, comment, and approval of the user
        request_id = request.json['request_id']
        print(request_id)
        if not request_id:
            abort(404, msg='Request ID not sent')
        form: LTCRequests = LTCRequests.query.get(int(request_id))
        if not form:
            abort(404, msg='Form not found')
        user_dept: Departments = Departments.query.get(current_user.department)
        if not user_dept.is_stage:
            abort(401, msg='Only stage users allowed')

        comment = request.json['comment']
        approval = True if str(
            request.json.get('approval')) == 'yes' else False
        print('Approval:', approval)

        form.addComment(current_user.department,
                        current_user, comment, approval)
        flag_modified(form, "comments")
        db.session.merge(form)
        print('Comments:', form.comments)
        if current_user.id == user_dept.dept_head:
            applicant: Users = Users.query.get(form.user_id)
            if not approval:
                form.decline(applicant)
                db.session.commit()
                return {'status': 'declined'}
            else:
                status, comment = form.forward(applicant)
                # important to call flag modified
                # flag_modified(form, "comments")
                # db.session.merge(form)
                db.session.commit()
                return {"Status": comment['msg']}, 200
        db.session.commit()
        return {"status": 'Comment added'}, 200


class GetLtcFormData(Resource):
    """
    Get LTC form data by request ID
    """
    @check_role()
    def post(self, **kwargs):
        request_id = request.json['request_id']
        if not request_id:
            abort(404, msg='Request ID not sent')
        form: LTCRequests = LTCRequests.query.get(int(request_id))
        if not form:
            abort(404, msg='Form not found')
        user_email = None
        if kwargs['permission'] == 'client':
            if form.user_id != current_user.id:
                return abort(403, status={'error': 'Forbidden resource'})
            user_email = current_user.email
        if not user_email:
            user_email = Users.query.get(form.user_id).email
        result = {
            'request_id': form.request_id,
            'email': user_email,
            'created_on': form.created_on,
            'stage': form.stage,
            'is_active': form.is_active,
            'form_data': form.form,
            'comments': form.comments
        }
        response = {'data': result}

        return jsonify(response)


class GetLtcFormAttachments(Resource):
    """
    Get LTC form attachments by request ID
    """
    @check_role()
    def post(self, permission):
        request_id = request.json['request_id']
        print(request_id)
        if not request_id:
            abort(404, msg='Request ID not sent')
        form: LTCRequests = LTCRequests.query.get(request_id)
        if not form:
            abort(404, msg='Form not found')
        if permission == 'client':
            if form.user_id != current_user.id:
                return abort(403, status={'error': 'Forbidden resource'})
        attachment_path = form.attachments
        if not attachment_path or attachment_path == "":
            return abort(404, status={'error': 'No attachment'})
        _, ext = os.path.splitext(attachment_path)
        filename = f'ltc_{request_id}_proofs'+ext
        abs_path = os.path.abspath(attachment_path)
        return send_file(abs_path, as_attachment=True, attachment_filename=filename)


class GetLtcFormMetaDataForUser(Resource):
    """
    Get LTC form data by user ID
    """
    @role_required('client')
    def get(self):
        user: Users = current_user
        forms = LTCRequests.query.filter_by(user_id=user.id)
        results = []
        for form in forms:
            form: LTCRequests
            results.append({
                'request_id': form.request_id,
                'created_on': (form.created_on),
                'stage': form.stage,
                'is_active': "Active" if form.is_active else "Not Active",
            })
        response = {'data': results}

        return jsonify(response)


class GetLtcFormMetaData(Resource):
    """
    Get LTC form metadata from LTC table
    """
    allowed_roles = [
        'admin',
        'deanfa',
        'registrar',
        'establishment',
        'accounts',
        'audit',
        'dept_head',
    ]

    @roles_required(roles=allowed_roles)
    def get(self, **kwargs):
        user: Users = current_user
        forms = db.session.query(LTCRequests, Users).join(Users).all()
        results = []
        for form, user in forms:
            form: LTCRequests
            user: Users
            results.append({
                'request_id': form.request_id,
                'user': user.email,
                'user_id': form.user_id,
                'created_on': form.created_on,
                'stage': form.stage,
                'is_active': "Active" if form.is_active else "Not Active",
            })
        response = {'data': results}

        return jsonify(response)


class GetPastApprovalRequests(Resource):
    allowed_roles = [
        'deanfa',
        'registrar',
        'establishment',
        'accounts',
        'audit',
        'dept_head'
    ]

    @roles_required(roles=allowed_roles)
    def get(self, **kwargs):
        user: Users = current_user
        department = user.department
        if kwargs['permission'] == 'dept_head':
            department = 'department'
        table_ref = Departments.getDeptRequestTableByName(department)

        if not table_ref:
            abort(
                404, msg={'Error': 'user department not registered as stage dept'})
        previous = []

        past = None
        new = None
        if kwargs['permission'] == 'dept_head':
            past = db.session.query(table_ref, LTCRequests, Users).join(Users).join(
                table_ref).filter(table_ref.status != 'new', table_ref.department == user.department)
            new = db.session.query(table_ref, LTCRequests, Users).join(Users).join(
                table_ref).filter_by(status='new', department=user.department)
        else:
            past = db.session.query(table_ref, LTCRequests, Users).join(
                Users).join(table_ref).filter(table_ref.status != 'new')
            new = db.session.query(table_ref, LTCRequests, Users).join(
                Users).join(table_ref).filter_by(status='new')

        for dept_log, form, applicant in past:
            previous.append({
                'request_id': form.request_id,
                'user': applicant.email,
                'name': applicant.name,
                'created_on': form.created_on,
                'stage': form.stage,
                'is_active': "Active" if form.is_active else "Not Active",
            })

        for dept_log, form, applicant in new:
            for comment in form.comments['comments']:
                if comment.get(user.department, None) and comment.get('review', False) == False\
                        and comment[user.department]['approved'].get(user.email, None) != None:
                    previous.append({
                        'request_id': form.request_id,
                        'user': applicant.email,
                        'name': applicant.name,
                        'created_on': form.created_on,
                        'stage': form.stage,
                        'is_active': "Active" if form.is_active else "Not Active",
                    })
        return jsonify({'pending': previous})


class GetPendingApprovalRequests(Resource):
    allowed_roles = [
        'deanfa',
        'registrar',
        'establishment',
        'accounts',
        'audit',
        'dept_head'
    ]

    @roles_required(roles=allowed_roles)
    def get(self, **kwargs):
        user: Users = current_user
        department = user.department
        if kwargs['permission'] == 'dept_head':
            department = 'department'
        table_ref = Departments.getDeptRequestTableByName(department)

        if not table_ref:
            abort(
                404, msg={'Error': 'user department not registered as stage dept'})
        new = None
        if kwargs['permission'] == 'dept_head':
            new = db.session.query(table_ref, LTCRequests, Users).join(Users).join(
                table_ref).filter_by(status='new', department=user.department)
        else:
            new = db.session.query(table_ref, LTCRequests, Users).join(
                Users).join(table_ref).filter_by(status='new')
        pending = []

        for dept_log, form, applicant in new:
            for comment in form.comments['comments']:
                if comment.get(user.department, None) and comment.get('review', False) == False\
                        and comment[user.department]['approved'].get(user.email, True) == None:
                    pending.append({
                        'request_id': form.request_id,
                        'user': applicant.email,
                        'name': applicant.name,
                        'created_on': form.created_on,
                        'stage': form.stage,
                        'is_active': "Active" if form.is_active else "Not Active",
                    })
        return jsonify({'pending': pending})
