document.addEventListener('DOMContentLoaded', () => {
	const sendToServer = document.getElementById('sendToServer');
	sendToServer.addEventListener('click', sendPizzaDataToServer);

	//load pizza data when page loads
	loadPizzaData();
);

function loadPizzaData() {
	fetch('/endpoint where pizza-data is saved')
	.then(response => response.json()) //convert to json
	.then(data => {
		populatePizzaTemplate(data); // populate pizza template with retrieved data
	})
	.catch(error => {
		console.error('Error:', error); // handle fetch errors
	});
}

// Populate HTML template with JSON data
 function populatePizzaTemplate(data) {
	 const menuContainer = document.querySelector('#template');
	 menuContainer.innerHTML = ''; // Clear existing content

	 //iterate thru categories and items to populate the template
         data.menu.categories.forEach(category => {
		 const categoryTitle = document.createElement('h2');
                 categoryTitle.textContent = category.name;
                 menuContainer.appendChild(categoryTitle);

                 const itemList = document.createElement('ul');
                 category.items.forEach(item => {
			 const listItem = document.createElement('li');
                         listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
                         itemList.appendChild(listItem);
                 });
		 menuContainer.appendChild(itemList);
	});
}

// serialize pizza html to json
function serializePizzaHTMLtoJSON() {
	const menuItems = [];
	document.querySelectorAll('.menu-item').forEach(item => {
		const name = item.querySelector('.item-name').textContent;
		const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
		menuItems.push({ name, price });
	});

	const accompaniments = [];
	document.querySelectorAll('.drink-item').forEach(item => {
		const name = item.querySelector('.item-name').textContent;
		const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
		accompaniments.push({ name, price });
	});

	const jsonData = {
		menu: {
			categories: [
				{ name: "Pizza", items: menuItems },
				{ name: "Accompaniments", items: accompaniments }
			]
		}
	};

	return JSON.stringify(jsonData);
}

// send json to server
function sendPizzaDataToServer() {
	const jsonData = serializePizzaHTMLtoJSON();

	fetch('/your/server/endpoint', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonData
	})
	.then(response => {
		if (response.ok) {
			console.log('Data sent successfully!');
		}
		else {
			console.error('Failed to send data to server.');
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
}
