#!/usr/bin/python3
""" Flask Application """
from models import storage
from api.v1.views import app_views
from flask import Flask, make_response, jsonify, render_template
from flask_session import Session
from flask_cors import CORS
import os


# Set the base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
print(f"Base directory: {BASE_DIR}")
print(f"Template directory: {os.path.join(BASE_DIR, 'templates')}")
STATIC_DIR = os.path.join(BASE_DIR, 'static')
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.register_blueprint(app_views)
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})



@app.route('/')
def index():
    """ route to render the index page"""
    return render_template('index.html')
  

@app.route('/login')
def login_and_signin():
    """ route to render the login page"""
    return render_template('login.html')


@app.teardown_appcontext
def close_db(error):
   """ Close Storage """
   storage.close()

@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    responses:
      404:
        description: a resource was not found
    """
    return make_response(jsonify({'error': "Not found"}), 404)


if __name__ == '__main__':
    app.run(debug=True, port=5000, host="0.0.0.0")