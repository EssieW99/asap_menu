from models.user import User
from models import storage
from api.v1.views import app_views
from flask import jsonify, request


@app_views.route('/users', methods=['POST'])
def create_user():
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

    return jsonify(new_user.to_dict), 201

@app_views.route('/users', methods=['GET'])
def get_users():
    """ fetches all the users"""

    users = storage.all(User).values()
    users_list = []
    for user in users:
        users_list.append(user)
    return jsonify(users_list)

@app_views.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """ fetches a user based on their id"""

    user = storage.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@app_views.route('/users/<user_id>', methods=['PUT'])
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

@app_views.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """ deletes a user"""

    user = storage.get(User, id)
    if not user:
        return jsonify ({'error': 'User not found'}), 404
    storage.delete_user(user)
    return jsonify ({'message': 'User deleted successfully'})
   

    