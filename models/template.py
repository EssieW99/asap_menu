#!/usr/bin/python3
""" a templates model"""

import models
from models.base_model import BaseModel
from sqlalchemy import DateTime, Column, String, Text
from sqlalchemy.orm import relationship


class Template(BaseModel):
    """
    template class for the templates
    """
    __tablename__ = 'templates'

    id = Column(String(60), primary_key=True)
    name = Column(String(128), nullable=False)
    description = Column(Text)
    thumbnail_url = Column(String(128), nullable=False)
    template_url = Column(String(128), nullable=False)
    customizations = relationship("Customization", backref="Template", overlaps="Template,customizations")
    created_at = Column(DateTime)
    updated_at = Column(DateTime)