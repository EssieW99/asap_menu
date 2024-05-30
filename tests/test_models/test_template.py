import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.base_model import BaseModel
from models.template import Template
from models.customization import Customization
from models.user import User
from sqlalchemy.exc import IntegrityError

class TestTemplateModel(unittest.TestCase):
    """Test template models"""
    @classmethod
    def setUpClass(cls):
        """set up database for testing"""
        cls.engine = create_engine('sqlite:///:memory:')
        BaseModel.metada.create_all(cls.engine)
        cls.Session = sessionmaker(bind=cls.engine)

    def setUp(self):
        """set up a new session for each test"""
        self.session = self.Session()
        """create a user for tests"""
        self.user = User(id='user_4')
        self.session.add(self.user)
        self.session.commit()

    def tearDown(self):
        """rollback changes made to database"""
        self.session.rollback()
        self.session.close()

    @classmethod
    def tearDownClass(cls):
        """drop database after tests"""
        BaseModel.metadata.drop_all(cls.engine)
        cls.engine.dispose()

    def test_template_creation(self):
        """test creating a new template"""
        template = Template(
                id='template_4',
                name='Test Template',
                description='this template is for testing',
                thumbnail_url='http://example.com/thumbnail.png',
                template_url='http://example.com/template.html'
        )
        self.session.add(template)
        self.session.commit()

        res = self.session.query(Template).filter_by(id='template_4')
        self.assertIsNotNone(res)
        self.assertEqual(res.name, 'Test Template')
        self.assertEqual(res.description, 'this template is for testing')
        self.assertEqual(res.thumbnail_url, 'http://example.com/thumbnail.png')
        self.assertEqual(res.template_url, 'http://example.com/template.html')

    def test_template_without_required_fields(self):
        """test template creation without required field"""
        with self.assertRaises(IntegrityError):
            template = Template(
                    id='t_456',
                    description='testing template',
                    thumbnail_url='http://example.com/thumb.jpg',
                    template_url='http://example.com/template.html'
            )
            self.session.add(template)
            self.session.commit()

    def test_template_with_optional_fields(self):
        """test template creation with optional fields"""
        template = Template(
                id='template_7',
                name='Test template',
                thumbnail_url='http://example.com/thumbnail.jpg',
                template_url='http://example.com/template.html'
        )
        self.session.add(template)
        self.session.commit()

        res = self.session.query(Template).filter_by(id='template_7')
        self.assertIsNotNone(res)
        self.assertEqual(res.name, 'Test template')
        self.assertEqual(res.thumbnail_url, 'http://example.com/thumbnail.jpg')
        self.assertEqual(res.template_url, 'http://example.com/template.html')
        self.assertIsNone(res.description)

if __name__ == '__main__':
    unittest.main()
