from flask import Flask, render_template, redirect, url_for, request, session
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user, login_manager

# Initialize app, database, and socket
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
socketio = SocketIO(app)
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# Chat message model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(500), nullable=False)

# Login manager user loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Homepage route
@app.route('/')
def index():
    return redirect(url_for('login'))

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            login_user(user)
            return redirect(url_for('chat'))
        else:
            return 'Invalid credentials'

    return render_template('login.html')

# Chat room route
@app.route('/chat')
@login_required
def chat():
    return render_template('chat.html', username=current_user.username)

# Handle messages
@socketio.on('send_message')
def handle_message(message):
    msg = Message(user_id=current_user.id, message=message)
    db.session.add(msg)
    db.session.commit()
    emit('receive_message', {'username': current_user.username, 'message': message}, broadcast=True)

# Run the app
if __name__ == '__main__':
    db.create_all()
    socketio.run(app, debug=True)
