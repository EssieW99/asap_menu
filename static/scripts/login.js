
    const container = document.getElementById('container');
    const signupButton = document.getElementById('register');
    const loginButton = document.getElementById('login');

    
    signupButton.addEventListener('click', () => {
        container.classList.add('active');
    });
    
    loginButton.addEventListener('click', () => {
        container.classList.remove('active');
    });


// register
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('https://asap-menu.onrender.com/api/v1/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            window.location.href = '/';
        }
    });
});

// login
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('log_username').value;
    const password = document.getElementById('log_password').value;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password})
    }
    fetch('https://asap-menu.onrender.com/api/v1/login', requestOptions)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            
            alert(data.message);
            window.location.href = '/';
        }
    });


});