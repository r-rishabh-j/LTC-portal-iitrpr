from flask_restful import reqparse

register_user_args = reqparse.RequestParser()
register_user_args.add_argument(
    "email", type=str, help="Email", required=True
)
register_user_args.add_argument(
    "password", type=str, help="Password", required=True
)
register_user_args.add_argument(
    "name", type=str, help="name", required=True
)
register_user_args.add_argument(
    "department", type=str, help="department", required=True
)

login_user_args = reqparse.RequestParser()
login_user_args.add_argument(
    "email", type=str, help="Email", required=True
)
login_user_args.add_argument(
    "password", type=str, help="Password", required=True
)

form_args = reqparse.RequestParser()
form_args.add_argument(
    "files"
)
