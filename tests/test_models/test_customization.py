import unittest
from models.base_model import BaseModel
from models.customization import Customization
from models.user import User
from models.template import Template
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError


class TestCustomizationModel(unittest.Testcase):
    """tests class customization"""
    @classmethod
    def setUpClass(cls):
        """set up database for testing"""
        cls.engine = create_engine('sqlite:///:memory:')
        BaseModel.metadata.create_all(cls.engine)
        cls.Session = sessionmaker(bind=cls.engine)

    def setUp(self):
        """set up a new session for each set"""
        self.session = self.Session()
        """create a user and template to be used for tests"""
        self.user = User(id='user_234')
        self.template = Template(id='template_234')
        self.session.add(self.user)
        self.session.add(self.template)
        self.session.commit()

    def tearDown(self):
        """rollback changes made to db"""
        self.session.rollback()
        self.session.close()

    @classmethod
    def tearDownClass(cls):
        """drop the database after tests"""
        BaseModel.metadata.drop_all(cls.engine)
        cls.engine.dispose()

    def test_create_customization(self):
        """test creating a new customization"""
        customization = Customization(
                user_id='user_1'
                customization_data={'color': 'blue'},
                template_id='template_1'
        )
        self.session.add(customization)
        self.session.commit()

        res = self.session.query(Customization).filter_by(user_id)
        self.assertIsNotNone(res)
        self.assertEqual(res.customization_data, {'color': 'blue'})
        self.assertEqual(res.template_id, 'template_1')

    def test_customization_without_user_id(self):
        """test customization creation without user id"""
        with self.assertRaises(IntegrityError):
            customization = Customization(
                    customization_data={'color': 'yellow'},
                    template_id='template_2'
            )
            self.session.add(customization)
            self.session.commit()

    def test_customization_without_customization_data(self):
        """test customization creation without customization_data"""
        with self.assertRaises(IntegrityError):
            customization = Customization(
                    user_id='user_2',
                    template_id='template_2'
            )
            self.session.add(customization)
            self.session.commit()


if __name__ == '__main__':
    unittest.main()
