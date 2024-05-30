document.addEventListener('DOMContentLoaded', () => {
	const sendToServer = document.getElementById('sendToServer');
	const deleteButton = document.getElementById('deleteButton');
	let customizationId;

	sendToServer.addEventListener('click', sendWeddingDataToServer);
	deleteButton.addEventListener('click', () => {
		if (customizationId) {
			deleteWeddingData(customizationId);
		}
	});

	//populate json data when page loads
	loadWeddingData();
});

function loadWeddingData(customizationId) {
	fetch(`/api/v1/customizations/${customizationId}`)
	.then(response => response.json()) //convert to json
	.then(data => {
		customizationId = data.customization_id;
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

	fetch(`/api/v1/customizations`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonData
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		else {
			throw new Error('Failed to send wedding data');
		}
	})
	.then(data => console.log('Success:', data))
	.catch(error => console.error('Error:', error));
}

function updateWeddingData(customizationId) {
	const jsonData = serializeWeddingHTMLtoJSON();

	fetch(`/api/v1/customizations/${customizationId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonData
	})
	.then(response => {
		if (response.ok) {
			console.log('Data updated successfully.');
		}
		else {
			console.error('update process failed:', response.statusText);
		}
	})
	.catch(error => {
		console.error('Error updating data:', error);
	});
}

function deleteWeddingData(customizationId) {
	fetch(`/api/v1/customizations/${customizationId}`, {
		method: 'DELETE'
	})
	.then(response => {
		if (response.ok) {
			console.log('Data deleted successfully.');
		}
		else {
			console.error('Deletion failed:', response.statusText);
		}
	})
	.catch(error => {
		console.error('Error deleting data:', error);
	});
}
