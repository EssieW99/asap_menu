from models.user import User
from models import storage
from api.v1.views import app_views
from flask import Flask
from flask import jsonify, request, current_app, session
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer as Serializer



def send_reset_email(user, token):
    """
    send a user the email with a token to facilitate resetting their password
    """
    pass


@app_views.route('/register', methods=['POST'])
def add_user():
    """ creates a new user"""

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing data'}), 400
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required field'}), 400
    
    """ check if the username is already taken"""
    used_username = storage.get_user_by_username(username)
    if used_username:
        return jsonify ({'error': 'Username already exists'}), 409
    
    new_user = storage.add_user(username=username, email=email, password=password)
    session['user_id'] = new_user.id
    return jsonify(new_user.to_dict()), 201

@app_views.route('/users', methods=['GET'])
def get_users():
    """ fetches all the users"""

    users = storage.all(User).values()
    users_list = [user.to_dict() for user in users]
    return jsonify(users_list)

@app_views.route('/login', methods=['POST'])
def login_user():
    """ logs in a returning user"""

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing data'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    user = storage.get_user_by_username(username)
    if user is None or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'message': 'Login successful', 'user_id': user.id}), 200

@app_views.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200

@app_views.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """ fetches a user based on their id"""

    user = storage.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@app_views.route('/login/<user_id>', methods=['PUT'])
def update_user(user_id):
    """ updates a user's information"""

    user = storage.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing data'}), 404
    
    ignore = ['id', 'created_at', 'email']
    for key, value in data.items():
        if key not in ignore:
            setattr(user, key, value)
    storage.save()
    return jsonify(user.to_dict()), 200

@app_views.route('/login/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """ deletes a user"""

    user = storage.get(User, id)
    if not user:
        return jsonify ({'error': 'User not found'}), 404
    storage.delete_user(user)
    return jsonify ({'message': 'User deleted successfully'})

@app_views.route('/api/v1/user_id', methods=['GET'])
def get_user_id():
    user_id = session.get('user_id')
    if user_id:
        return jsonify({'user_id': user_id}), 200
    else:
        return jsonify({'error': 'User not authenticated'}), 401


@app_views.route('/password_reset_request', methods=['POST'], strict_slashes=False)
def password_reset_request():
    data = request.get_json()
    email = data.get('email')

    user = storage.get_user_by_email(email)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    serializer = Serializer(current_app.config['SECRET_KEY'])
    token = serializer.dumps(email, salt='password-reset-salt')
    send_reset_email(user, token)
    return jsonify({'message': 'Password reset email sent'}), 200

@app_views.route('/reset_password/<token>', methods=['POST'], strict_slashes=False)
def reset_password(token):
    data = request.get_json()
    new_password = data.get('new_password')

    user = storage.get_user_by_reset_token(token)
    if user is None or user.reset_token_expiration < datetime.utcnow():
        return jsonify({'error': 'Invalid or expired token'}), 400

    user.password = new_password  # This will call the setter to hash the password
    user.reset_token = None
    user.reset_token_expiration = None
    storage.update_user(user)

    return jsonify({'message': 'Password updated successfully'}), 200

    