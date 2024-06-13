#!/usr/bin/python3
""" contains class Basemodel"""

from datetime import datetime, timezone
import sqlalchemy
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import uuid


Base = declarative_base()
class BaseModel(Base):
    """
    BaseModel class from which future classes will inherit
    """

    __abstract__ = True
    id = Column(String(60), primary_key=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))



    def __init__(self, *args, **kwargs):
        """ initialization of a base model """

        super().__init__(*args, **kwargs)
        if 'id' not in kwargs:
            self.id = str(uuid.uuid4())
        if 'created_at' not in kwargs:
            self.created_at = datetime.now(timezone.utc)
        if 'updated_at' not in kwargs:
            self.updated_at = self.created_at
    

    def __str__(self):
        """String representation of the BaseModel class"""
        return "[{:s}] ({:s}) {}".format(self.__class__.__name__, self.id,
                                         self.__dict__)

    def to_dict(self):
        """ converts instance attributes to a dictionary"""

        dict_repr = {key: value if not isinstance(value, datetime) else value.isoformat()
                     for key, value in self.__dict__.items() if not key.startswith('_')}
        return dict_repr