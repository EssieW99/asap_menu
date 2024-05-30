import unittest
from models.user import User

class TestUser(unittest.TestCase):

    def setUp(self):
        """set up a user object for testing"""
        self.user = User(username="test_user", email="test@example.com")

    def test_user_initialization(self):
        """test if user object is initialized correctly"""
        self.assertEqual(self.user.username, "test_user")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertIsNone(getattr(self.user, 'password', None))

    def test_password_setter(self):
        """test setting up a password"""
        self.user.password = "secret"
        self.assertIsNotNone(self.user.password_hash)
        self.assertNotEqual(self.user.password_hash, "secret")

    def test_password_getter_raises_error(self):
        """test that accessing the pword, raises an att error"""
        with self.assertRaises(AttributeError):
            _= self.user.password

    def test_check_password(self):
        """test password verification"""
        self.user.password = "secret"
        self.assertTrue(self.user.check_password("secret"))
        self.assertFalse(self.user.check_password("wrong_password"))

if __name__ == '__main__':
    unittest.main()
