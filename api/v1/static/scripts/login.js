const loginForm = document.getElementById('login-form');
const message = document.getElementById('message');

loginForm.addEventListener('submit', (event) => {
	event.preventDefault(); // Prevent default form submission

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;
	
	const url = '/api/v1/login';

	// Create a request object with credentials 
	const data = {
		username,
		email,
	        password,
	};
		
	fetch(url, {
		method: 'POST',
	        headers: {
			'Content-Type': 'application/json'
	        },
		body: JSON.stringify(data) // Convert data to JSON string for body
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			// Login successful, handle token and redirect
	        	console.log('Login successful!');
	        	localStorage.setItem('token', data.token);
	        	window.location.href = 'index.html';
		}
		else {
			message.textContent = data.message || 'Login failed!';
		}
	})
	.catch(error => {
		console.error('Error:', error);
		message.textContent = 'An error occurred. Please try again.';
	});
});
