#!/usr/bin/python3
""" custmizations class"""

import models
from models.base_model import BaseModel
from models.template import Template
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey, PrimaryKeyConstraint, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB


class Customization(BaseModel):
    """"
    cutomizations model for the template customizaitons
    """

    __tablename__ = "customizations"

    """ foreign keys"""
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(60), ForeignKey("users.id"), nullable=False, autoincrement=True)
    customization_data = Column(JSONB, nullable=False)
    template_id = Column(String(60), ForeignKey("templates.id"))

    """ relationship"""
    user = relationship("User", backref="customizations_ref")

