#!/usr/bin/python3
""" contains the class DBStorage"""

from dotenv import load_dotenv
import models
from models.base_model import Base
from models.template import Template
from models.customization import Customization
from models.user import User
import os
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

classes = {"Template": Template, "Customization": Customization, "User": User}


class DBStorage:
    """ interacts with the PostgreSQL database"""

    __engine = None
    __session = None

    def __init__(self):
        """ instance of a DBStorage object"""

        """ load env variables from .env file"""
        load_dotenv()

        """ retrieve database credentials"""
        POSTGRES_USER = os.getenv('POSTGRES_USER')
        POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
        POSTGRES_HOST = os.getenv('POSTGRES_HOST')
        POSTGRES_DB = os.getenv('POSTGRES_DB')

        try:
            """ create an engine for postgreSQL"""
            self.__engine = create_engine(
                f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:5432/{POSTGRES_DB}'
            )

            connect = self.__engine.connect()
            from sqlalchemy.sql import text
            query = text("SELECT 1")
            result = connect.execute(query)
            print("Database connection successful")
        except Exception as e:
            raise ConnectionError(f"Failed to connect to the database: {e}")


    def add_template(self, name, description, thumbnail_url, template_url):
        """ adds a new object to the template table"""
        template = Template(name=name, description=description, thumbnail_url=thumbnail_url, template_url=template_url)
        self.__session.add(template)
        self.__session.commit()
        return template

    def add_customization(self, template_id, customization_data):
        """ adds a new object to the customizations table"""
        customization = Customization(template_id=template_id, customization_data=customization_data)
        self.__session.add(customization)
        self.__session.commit()
        return customization
    
    def add_user(self, username, email, password):
        """ adds a new user to the database"""
        user = User(username=username, email=email, password=password)
        self.__session.add(user)
        self.__session.commit()
        return user

    def save(self):
        """ commits the current session changes"""
        self.__session.commit()

    def update_template(self, id, data):
        """ updates changes made to a menu template"""
        template = self.__session.query(Template).get(id)
        if not template:
            return None

        if template:
            if 'name' in data:
                template.name = data['name']
            if 'description' in data:
                template.description = data['description']
            if 'thumbnail_url' in data:
                template.thumbnail_url = data['thumbnail_url']
            if 'template_url' in data:
                template.template_url = data['template_url']

        self.__session.commit()
        return template

    def update_customization(self, id, data):
        """ updates data to a customized menu template"""
        customization = self.__session.query(Customization).get(id)
        if not customization:
            return None
        
        if customization:
            if 'customization_data' in data:
                customization.customization_data = data['customization_data']

        self.__session.commit()
        return customization
        
    def delete_template(self, id):
        """ deletes a template from the template table"""
        template = self.__session.query(Template).get(id)
        if template:
            self.__session.delete(template)
            self.__session.commit()
            print("Deletion Successful")
        else:
            print("Error deleting the template: Not Found")
            return None

    def delete_customization(self, id):
        """ deletes a customized template from the database"""
        customization = self.__session.query(Customization).get(id)
        if customization:
            self.__session.delete(customization)
            self.__session.commit()
            print("Deletion Successful")
        else:
            print("Error deleting the template: Not Found")
            return None
    
    def delete_user(self, id):
        """ deletes a user"""
        user = self.__session.query(User).get(id)
        if user:
            self.__session.delete(user)
            self.__session.commit()
            print("Deletion successful")
        else:
            print("Error deleting the user: Not found")
            return None

    def get(self, cls, id):
        """
        retrieves an object based on its class and ID or None if not found
        """

        if cls not in classes.values():
            return None
        else:
            try:
                return self.__session.get(cls, id)
            except Exception as e:
                print(f"Error receiving {cls.__name__} with id {id}: {e}")
                return None

    def get_user_by_username(self, username):
        """ gets a user based on their username"""

        return self.__session.query(User).filter_by(username=username).first()

    def all(self, cls=None):
        """ retrieves all objects or of a particular class"""

        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return (new_dict)
    
    def reload(self):
        """ realoads data from the database"""

        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session
    
    def close(self):
        """ closes the current session"""

        self.__session.remove()
