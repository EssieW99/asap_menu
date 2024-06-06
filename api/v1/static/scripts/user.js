const userForm = document.getElementById('userForm');

userForm.addEventListener('submit', function(event) {
	event.preventDefault();

	const userName = document.getElementById('userName').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	const userData = {
		username: userName,
		email: email,
		password: password
	};
	if (userId) {
		updateUser(userId, userData);
	}
	else {
		createUser(userData);
	}
});

// Function to create a new user
function createUser(userData) {
	fetch(`/api/v1/users`, {
		method: 'POST',
                headers: {
			'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
        })
        .then(response => {
		if (response.ok) {
			return response.json();
		}
		else if (response.status === 409) {
			console.error('Username already exists');
		}
		else {
			console.error('Failed to create user:');
		}
        })
        .then(data => {
		const userId = data.id;
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
	.then(data => {
		if (data.error) {
			console.error('error fetching users:', data.error);
		}
		else {
			const users = data.users;
			console.log('Users:', users);
		}
	})
	.catch(error => {
		console.error('Error fetching users:', error);
	});
}

// Function to fetch a user by ID
function getUserById(userId) {
	fetch(`/api/v1/users/${userId}`)
	.then(response => response.json())
	.then (data => {
		if (data.error) {
			console.error('Failed to fetch user:', data.error);
		}
		else {
			const user = data;
			console.log('User:', user);
			document.getElementById('username').textContent = user.username;
			document.getElementById('email').textContent = user.email;
		}
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
	.then(response => response.json())
	.then(data => {
		if (data.error) {
			console.error('Error updating User:', data.error);
		}
		else {
			console.log('User updated successfully:', data)
			document.getElementById('username').textContent = data.username;
			document.getElementById('email').textContent = data.email;
		}
	})
	.catch(error => {
		console.error('Error updating user:', error);
	});
}

// Function to delete a user
function deleteUser(userId) {
	if (confirm('Are you sure you want to delete this user?')) {
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
	else {
		console.log('User deletion cancelled');
	}
}
