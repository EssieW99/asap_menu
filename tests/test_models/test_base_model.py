import unittest
from datetime import datetime
from models import BaseModel
import uuid

class TestBaseModel(unittest.Testcase):
    """main function where tests will inherit from"""

    def setUp(self):
        """initialize and setup the tests"""
        self.model = BaseModel()

    def test_initialization(self):
        """test initialization of basemodel"""
        self.assertTrue(uuid.UUID(self.model.id))
        self.assertIsInstance(self.model.id, str)
        self.assertIsInstance(self.model.created_at, datetime)
        self.assertIsInstance(self.model.updated_at, datetime)

    def test_initialization_with_kwargs(self):
        """test the initialization with kwargs"""
        dt_now = datetime.now(timezone.utc)
        model = BaseModel(id='2345', created_at=dt_now, updated_at=dt_now)
        self.assertEqual(model.id, '1234')
        self.assertEqual(model.created_at, dt_now)
        self.assertEqual(model.updated_at, dt_now)

    def test_str_method(self):
        """tests the __str__ method"""
        string = str(self.model)
        self.assertIn(self.model.__class__.__name__, string)
        self.assertIn(self.model.id, string)
        self.assertIn(str(self.model.__dict__), string)

    def test_to_dict_method(self):
        """test the to_dict method"""
        dict_repr = self.model.to_dict()
        self.assertEqual(dict_repr['id'], self.model.id)
        self.assertEqual(dict_repr['created_at'], self.model.created_at.isoformat())
        self.assertEqual(dict_repr['updated_at'], self.model.updated_at.isoformat())


if __name__ == '__main__':
    unittest.main()
