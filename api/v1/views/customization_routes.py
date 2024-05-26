from models.customization import Customization
from models import storage
from api.v1.views import app_views
from flask import jsonify, request


@app_views.route('/customizations', methods=['POST'])
def create_customization():
    data = request.json
    new_customization = storage.add_customization(
        user_id=data['user_id'],
        template_id=data['template_id'],
        customization_data=data['customization_data']
    )
    return jsonify(new_customization.to_dict()), 201

@app_views.route('/customizations/<customization_id>', methods=['GET'])
def get_customization(customization_id):
    customization = storage.get(Customization, customization_id)
    if customization:
        return jsonify(customization.to_dict()), 200
    return jsonify({'error': 'Customization not found'}), 404

@app_views.route('/customizations', methods=['GET'])
def get_all_customizations():
    customizations = storage.get_all_customizations()
    return jsonify([customization.to_dict() for customization in customizations]), 200

@app_views.route('/customizations/<customization_id>', methods=['PUT'])
def update_customization(customization_id):
    data = request.json
    updated_customization = storage.update_customization(customization_id, **data)
    if updated_customization:
        return jsonify(updated_customization.to_dict()), 200
    return jsonify({'error': 'Customization not found'}), 404

@app_views.route('/customizations/<customization_id>', methods=['DELETE'])
def delete_customization(customization_id):
    success = storage.delete_customization(customization_id)
    if success:
        return jsonify({'message': 'Customization deleted successfully'}), 200
    return jsonify({'error':'Customization not found'}), 404