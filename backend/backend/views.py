from crypt import methods
from urllib import request
from flask import Blueprint, render_template
from flask_login import login_required, current_user

views = Blueprint('views', __name__)

@views.route('/')
@login_required
def home():
    return render_template("home.html", user=current_user)

@views.route('form', methods=['GET', 'POST'])
def form():
    if request.method=='POST':
        pass
