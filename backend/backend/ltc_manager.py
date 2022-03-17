import os
import json
from . import db
from . import filemanager
from flask import jsonify, request, make_response, send_file
from flask_restful import Resource, reqparse, abort, fields
from .models import Users, LTCRequests, Departments
from flask_jwt_extended import current_user
from .role_manager import role_required, roles_required, check_role


class ApplyForLTC(Resource):
    """
    Puts the request in LTCRequests, DepartmentLogs and Establishment Logs
    """

    def initialiseApplication(self, new_request: LTCRequests, current_user: Users):
        db.session.add(new_request)
        db.session.commit()
        db.session.refresh(new_request)
        new_request.forward(current_user=current_user)
        db.session.commit()

    @role_required('client')
    def post(self):
        file = request.files.get('attachments')
        print(file)
        form_data = json.loads(request.form.get('form'))
        user: Users = current_user
        if user:
            filepath = None
            if file != None:
                filepath = filemanager.saveFile(file, user.id)
            print(form_data)
            form_data.pop('attachments')
            new_request: LTCRequests = LTCRequests(user_id=user.id)
            new_request.form, new_request.attachments = form_data, filepath
            self.initialiseApplication(new_request, user)
            return make_response(jsonify({'status': 'ok', 'msg': 'Applied for LTC'}), 200)
        else:
            abort(400, status=jsonify(
                {'status': 'error', 'msg': 'user not found'}))


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
        current_user: Users
        request_id = request.json['request_id']
        if not request_id:
            abort(404, msg='Request ID not sent')
        form: LTCRequests = LTCRequests.query.get(int(request_id))
        if not form:
            abort(404, msg='Form not found')
        comment = request_id.json['comment']
        approval = True if str(
            request_id.json.get['approval']) == 'yes' else False
        dept = current_user.department
        commentor_id = current_user.email
        form.comments[dept]['comments'][commentor_id] = str(comment)
        form.comments[dept]['approved'][commentor_id] = approval

        dept_head: Departments = Departments.query.get(current_user.department)
        if current_user.id == dept_head.dept_head:
            if not approval:
                # decline application
                return {"Error": "Not implemented decline"}, 400
            else:
                status, comment = form.forward(current_user)
                db.session.commit()
                return {"Status": comment['msg']}, 200
        db.session.commit()
        return {"Status": 'Comment added'}, 200


class GetLtcFormData(Resource):
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
    @check_role()
    def post(self, **kwargs):
        request_id = request.json['request_id']
        print(request_id)
        if not request_id:
            abort(404, msg='Request ID not sent')
        form: LTCRequests = LTCRequests.query.get(request_id)
        if not form:
            abort(404, msg='Form not found')
        if kwargs['permission'] == 'client':
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
    @role_required('client')
    def get(self):
        user: Users = current_user
        forms = LTCRequests.query.filter_by(user_id=user.id)
        results = []
        for form in forms:
            form: LTCRequests
            results.append({
                'request_id': form.request_id,
                'created_on': form.created_on,
                'stage': form.stage,
                'is_active': "Active" if form.is_active else "Not Active",
            })
        response = {'data': results}

        return jsonify(response)


class GetLtcFormMetaData(Resource):
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
                'is_active': form.is_active,
            })
        response = {'data': results}

        return jsonify(response)
