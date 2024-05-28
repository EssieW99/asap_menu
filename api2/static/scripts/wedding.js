document.addEventListener('DOMContentLoaded', () => {
	const sendToServer = document.getElementById('sendToServer');
	sendToServer.addEventListener('click', sendWeddingDataToServer);

	//populate json data when page loads
	loadWeddingData();
);

function loadWeddingData() {
	fetch('/endpoint where catering-data is saved')
	.then(response => response.json()) //convert to json
	.then(data => {
		populateWeddingHTML(data);
	})
	.catch(error => {
		console.error('Error loading JSON data:', error); // handle fetch errors
	});
}

function populateWeddingHTML(data) {
	// Set the menu title
	document.querySelector('header h1').textContent = data.menu.title;
         
	// Get the container for menu items
	const menuItemsContainer = document.querySelector('.menu-items');
	menuItemsContainer.innerHTML = ''; // Clear existing items if any
                         
	// Populate the menu items
	data.menu.items.forEach(item => {
		const article = document.createElement('article');
	        article.classList.add('menu-item');

		const contentDiv = document.createElement('div');
	        contentDiv.classList.add('menu-item-content');
	        contentDiv.setAttribute('contenteditable', 'true');
                                                                                 
		const title = document.createElement('h3');
	        title.classList.add('menu-item-title');
	        title.textContent = item.title;
                                                                                                               
                const description = document.createElement('p');
	        description.classList.add('menu-item-description');
	        description.textContent = item.description;
                                                                                                                                                 
		const price = document.createElement('p');
	        price.classList.add('menu-item-price');
	        price.textContent = `$${item.price.toFixed(2)}`;
                                                                                                                                 contentDiv.appendChild(title);
		contentDiv.appendChild(description);
		contentDiv.appendChild(price);
		article.appendChild(contentDiv);
	        menuItemsContainer.appendChild(article);
	});
}

function serializeWeddingHTMLtoJSON() {
	const menuItems = [];

	document.querySelectorAll('.menu-item').forEach(item => {
		const title = item.querySelector('.menu-item-title').textContent.trim();
		const description = item.querySelector('.menu-item-description').textContent.trim();
		const price = parseFloat(item.querySelector('.menu-item-price').textContent.replace('$', '').trim());
 
		menuItems.push({ title, description, price });
	});

	const jsonData = {
		menu: {
			title: document.querySelector('header h1').textContent.trim(),
			items: menuItems
		}
	};

	return JSON.stringify(jsonData);
}

function sendWeddingDataToServer() {
	const jsonData = serializeWeddingHTMLtoJSON();

	fetch('/your-endpoint-url', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonData
	})
	.then(response => response.json())
	.then(data => console.log('Success:', data))
	.catch(error => console.error('Error:', error));
}
