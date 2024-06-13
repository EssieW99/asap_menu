#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint

app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')

from api.v1.views.template_routes import *
from api.v1.views.customization_routes import *
from api.v1.views.user_routes import *
