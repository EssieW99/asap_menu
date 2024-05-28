document.addEventListener("DOMContentLoaded", () => {
	const sendToServer = document.getElementById('sendToServer');
	sendToServer.addEventListener('click', sendRestaurantDataToServer);

	loadRestaurantData();
});

function loadRestaurantData() {
	fetch('/endpoint-where-restaurant-data-is-saved')
	.then(response => response.json())
	.then(data => {
		populateRestaurantTemplate(data);
	})
	.catch(error => {
	        console.error('Error fetching restaurant data:', error);
	});
}

function populateRestaurantTemplate(data) {
	// Populate restaurant template
	const restaurantName = document.querySelector('header h1');
	restaurantName.textContent = data.restaurant_name;
	
	// Populate menu sections
	const menuSections = document.querySelectorAll('.menu-section');
	data.menu_sections.forEach((section, index) => {
		const sectionElement = menuSections[index];
	        sectionElement.querySelector('h2').textContent = section.section_name;

                const itemList = section.items.map(item => `<li>${item.name} <span>$${item.price.toFixed(2)}</span></li>`).join('');
	        sectionElement.querySelector('ul').innerHTML = itemList;
	});

	// Populate footer message
	const footerMessage = document.querySelector('footer p');
	footerMessage.textContent = data.footer_message;
}

function serializeRestaurantHTMLtoJSON() {
	// Serialize restaurant HTML to JSON format
	const restaurantHTML = document.getElementById('template').outerHTML;
	return JSON.stringify({ restaurant_html: restaurantHTML });
}
	
function sendRestaurantDataToServer() {
        const jsonData = serializeRestaurantHTMLtoJSON();
        fetch('/endpoint-to-save-restaurant-data', {
		method: 'POST',
	        headers: {
			'Content-Type': 'application/json'
		},
	        body: jsonData
	})
	.then(response => {
		if (response.ok) {
			console.log('Restaurant data sent successfully!');
	        }
		else {
			console.error('Failed to send restaurant data');
	        }
	})
	.catch(error => {
		console.error('Error:', error);
	});
}
