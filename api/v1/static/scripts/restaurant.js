document.addEventListener("DOMContentLoaded", () => {
	const sendToServer = document.getElementById('sendToServer');
	const deleteButton = document.getElementById('deleteButton');
	const customizationId = null;


	sendToServer.addEventListener('click', sendRestaurantDataToServer);
	//leteButton.addEventListener('click', () => {
	//f (customizationId) {
	//deleteRestaurantData(customizationId);
///
//);
//
//f (customizationId) {
//loadRestaurantData(customizationId);
//
//lse {
//console.error('Customization id not found in url');
//
});

function loadRestaurantData(customizationId) {
	fetch(`/api/v1/customizations/${customizationId}`)
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
	const user_id = "9d6a2cf4-11e6-4bfe-833c-8042b54d6d36";
	const template_id = "template123";

	return JSON.stringify({
		customization_data: restaurantHTML,
		user_id: user_id,
		template_id: template_id
	});
}

function sendRestaurantDataToServer() {
        const jsonData = serializeRestaurantHTMLtoJSON();
        fetch(`http://127.0.0.1:5000/api/v1/customizations`, {
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

function updateRestaurantData(customizationId) {
	const jsonData = serializeRestaurantHTMLtoJSON();

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


//function to delete existing customization
function deleteRestaurantData(customizationId) {
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
