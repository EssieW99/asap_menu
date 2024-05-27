from models.customization import Customization
from models import storage
from api.v1.views import app_views
from flask import jsonify, request


@app_views.route('/customizations', methods=['POST'])
def create_customization():
    """ adds a customized template to the database"""
    data = request.json
    new_customization = storage.add_customization(
        user_id=data['user_id'],
        template_id=data['template_id'],
        customization_data=data['customization_data']
    )
    return jsonify(new_customization.to_dict()), 201

@app_views.route('/customizations/<customization_id>', methods=['GET'])
def get_customization(customization_id):
    """ fetches a customized template based on its id"""
    customization = storage.get(Customization, customization_id)
    if customization:
        return jsonify(customization.to_dict()), 200
    return jsonify({'error': 'Customization not found'}), 404

@app_views.route('/customizations', methods=['GET'])
def get_all_customizations():
    """ fetches all the customized templates"""
    customizations = storage.get_all_customizations()
    return jsonify([customization.to_dict() for customization in customizations]), 200

@app_views.route('/customizations/<customization_id>', methods=['PUT'])
def update_customization(customization_id):
    """ updates a customized templates"""
    customization = storage.get(Customization, customization_id)
    if not customization:
        return jsonify({'error': 'Customization not found'}), 404

    data = request.json
    updated_customization = storage.update_customization(customization_id, **data)
    return jsonify(updated_customization.to_dict()), 200
    

@app_views.route('/customizations/<customization_id>', methods=['DELETE'])
def delete_customization(customization_id):
    """ deletes a customized template"""
    customization = storage.get(Customization, customization_id)
    if not customization:
        return jsonify({'error':'Customization not found'}), 404
    storage.delete_customization(customization_id)
    return jsonify({'message': 'Customization deleted successfully'}), 200
    