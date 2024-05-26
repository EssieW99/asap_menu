#!/usr/bin/python3
""" Users class"""

import models
from models.base_model import BaseModel
from models.customization import Customization
from models.template import Template
import sqlalchemy
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from hashlib import md5


class User(BaseModel):
    """" a users model to store a user's details"""

    __tablename__ = "users"

    username = Column(String(128), nullable=False, unique=True)
    email = Column(String(128), nullable=False)
    password_hash = Column(String(128), nullable=False)


    @property
    def password(self):
        """ raises an error when accessing the password directly"""

        raise AttributeError("Password is not a readable attribute")
    
    @password.setter
    def password(self, password):
        """ sets the value of the password"""
        self.password_hash = md5(password.encode()).hexdigest()
    
    def check_password(self, password):
        """
        verifies if a given password matches the stored password_hash.
        Returns True if it matches and False if it doesn't
        """
        return self.password_hash == md5(password.encode()).hexdigest()
