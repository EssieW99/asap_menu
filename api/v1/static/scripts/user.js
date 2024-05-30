const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// Function to create a new user
function createUser(username, email, password) {
	fetch(`/api/v1/users`, {
		method: 'POST',
                headers: {
			'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
        })
        .then(response => {
		if (response.ok) {
			return response.json();
		}
		else {
			console.error('Failed to create user:');
		}
        })
        .then(data => {
		userId = data.user_id;
		console.log('User created successfully:', data);
        })
        .catch(error => {
		console.error('Error creating user:', error);
        });
}

// Function to fetch all users
function getAllUsers() {
	fetch(`/api/v1/users`)
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		else {
			console.error('Failed to fetch users:');
		}
	})
	.then(users => {
		console.log('Users:', users);
	})
	.catch(error => {
		console.error('Error fetching users:', error);
	});
}

// Function to fetch a user by ID
function getUserById(userId) {
	fetch(`/api/v1/users/${userId}`)
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		else {
			console.error('Failed to fetch user:');
		}
	})
	.then(user => {
		console.log('User:', user);
	})
	.catch(error => {
		console.error('Error fetching user:', error);
	});
}

// Function to update a user
function updateUser(userId, userData) {
	fetch(`/api/v1/users/${userId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		else {
			console.error('Failed to update user:');
		}
	})
	.then(data => {
		console.log('User successfully updated:', data);
	})
	.catch(error => {
		console.error('Error updating user:', error);
	});
}

// Function to delete a user
function deleteUser(userId) {
	fetch(`/api/v1/users/${userId}`, {
		method: 'DELETE'
	})
	.then(response => {
		if (response.ok) {
			console.log('User successfully deleted');
		}
		else {
			console.error('Failed to delete user:');
		}
	})
	.catch(error => {
		console.error('Error deleting user:', error);
	});
}
