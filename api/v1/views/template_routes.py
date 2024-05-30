#!/usr/bin/python3
""" handles all default RestFul API actions for Template"""
from models.base_model import  BaseModel, Base
from models.template import Template
from models import storage
from api.v1.views import app_views
from flask import current_app, jsonify, request
from werkzeug.utils import secure_filename
import os

def allowed_file(filename):
    """
    
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx'}


@app_views.route('/templates', methods=['POST'], strict_slashes=False)
def create_template():
    """ adds a new template"""

    """
    checks if the 'thumbnail' and 'template' files are part of the incoming request
    """
    if 'thumbnail_url' not in request.files or 'template_url' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    " retrieves the 'thumbnail' and 'template' from request"
    thumbnail = request.files['thumbnail_url']
    template_file = request.files['template_url']
    if thumbnail.filename == '' or template_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    " checks if the file type is allowed and not None"
    if thumbnail and allowed_file(thumbnail.filename) and template_file:
        thumbnail_filename = secure_filename(thumbnail.filename)
        template_filename = secure_filename(template_file.filename)

        " save the files"
        thumbnails_path = os.path.join(current_app.root_path, 'static/thumbnails')
        templates_path = os.path.join(current_app.root_path, 'templates')
        os.makedirs(thumbnails_path, exist_ok=True)
        os.makedirs(templates_path, exist_ok=True)
        thumbnail.save(os.path.join(thumbnails_path, thumbnail_filename))
        template_file.save(os.path.join(templates_path, template_filename))

        " save template information to the database"
        data = request.form
        new_template = storage.add_template(
            name=data['name'],
            description=data.get('description'),
            thumbnail_url=f'static/images/{thumbnail_filename}',
            template_url=f'templates/menu_templates/{template_filename}'
        )
        return jsonify(new_template.to_dict()), 201
    else:
        return jsonify({'error': 'File type not allowed'}), 400

@app_views.route('/templates/<template_id>', methods=['GET'])
def get_template(template_id):
    """ gets a template based on its id"""
    template = storage.get(Template, template_id)
    if not template:
        return jsonify({'message': 'Template not found'}), 404

    return jsonify(template.to_dict()), 200

@app_views.route('/templates', methods=['GET'])
def get_templates():
    """ gets all the templates"""
    templates = storage.all(Template)
    return jsonify([template.to_dict() for template in templates.values()]), 200

@app_views.route('/thumbnails', methods=['GET'])
def get_thumbnails():
    """ fetches all the thumbnails from the database"""
    templates = storage.all(Template)
    return jsonify([templates.thumbnail_url for template in templates]), 200

@app_views.route('/templates/<template_id>', methods=['PUT'])
def update_template(template_id):
    """ updates the contents of a template """

    template = storage.get(Template, template_id)
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    data = request.json
    updated_template = storage.update_template(template_id, data)
        
    return jsonify(updated_template.to_dict()), 200

@app_views.route('/templates/<template_id>', methods=['DELETE'])
def delete_template(template_id):
    """ deletes a template based on its id"""
    template = storage.get(Template, template_id)
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    template = storage.delete_template(template_id)
    return jsonify({'message': 'Template deleted successfully'}), 200
