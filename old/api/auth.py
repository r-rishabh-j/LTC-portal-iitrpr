import sys
import flask
from flask import Blueprint, render_template, flash, request, redirect, url_for
from ...backend.backend.models import Users
from werkzeug.security import generate_password_hash, check_password_hash
from ...backend.backend import db
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # data = request.form
    # print(data)
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = Users.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')
                login_user(user, remember=True) 
                return redirect(url_for('views.home'))
            else:
                flash('Incorrect password, try again', category='error')
        else:
            flash('Email does not exist', category='error')

    return render_template("login.html", user=current_user)


@auth.route('/logout')
@login_required
def logout():
    # perform logout operation
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        firstName = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        user = Users.query.filter_by(email=email).first()
        error = False
        if user:
            print(user, "hi", file=sys.stdout)
            error = True
            flash("Email already exists", category='Error')
        elif len(email) < 4:
            flash('Email wrong', category='error')
            error = True
        elif len(firstName) < 2:
            flash('Firstname short', category='error')
            error = True
        elif password2 != password1:
            error = True
            flash('Passwords don\'t match', category='error')
        elif len(password1) < 4:
            error = True
            flash('Passwords too short', category='error')
        else:
            new_user = Users(email=email, first_name=firstName,
                            password=generate_password_hash(password1, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('Account created', category='success')
            return redirect(url_for('views.home'))

    return render_template("sign_up.html", user=current_user)
