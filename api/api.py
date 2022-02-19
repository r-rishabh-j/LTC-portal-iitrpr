from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
CORS(app)
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.Text, nullable=False)

    def __str__(self):
        return f'{self.id} {self.content}'

def todo_serializer(todo):
    return {
        'id': todo.id,
        'content': todo.content
    }

@app.route('/api', methods = ['GET'])
def index():
    return jsonify([*map(todo_serializer, Todo.query.all())])

# @app.route('/api/create', methods=['POST'])
# def create():
#     request_data = json.loads(request.data) #converts into Py dict
#     todo = Todo(content = request_data['content'])

#     db.session.add(todo)
#     db.session.commit()

#     return{'201': 'created successfully'}

if __name__ == '__main__':
    app.run(debug=True)