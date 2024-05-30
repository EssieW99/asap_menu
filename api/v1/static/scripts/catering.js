document.addEventListener('DOMContentLoaded', () => {
	const sendToServer = document.getElementById('sendToServer');
	const deleteButton = document.getElementById('deleteButton');
	const urlParams = new URLSearchParams(window.location.search);
	const customizationId = urlParams.get('id');

	sendToServer.addEventListener('click', sendCateringDataToServer);
	deleteButton.addEventListener('click', () => {
		if (customizationId) {
			deleteCateringData(customizationId);
		}
	});

	//populate json data when page loads
	if (customizationId) {
		loadCateringData(customizationId);
	}
	else {
		console.error('Customization id not found in url')
	}

});


function loadCateringData(customizationId) {
	fetch(`/api/v1/customizations/${customizationId}`)
	.then(response => response.json()) //convert to json
	.then(data => {
		populateTemplate(data);
	})
	.catch(error => {
		console.error('Error loading JSON data:', error); // handle fetch errors
	});
}

function populateTemplate(data) {
	const template = document.getElementById('template');
	template.innerHTML = ''; // clear existing content
	
	// create and append title
	const title = document.createElement('h1');
	title.contentEditable = 'true';
	title.textContent = data.title || 'Catering Menu'; //use default title
	template.appendChild(title);

	// create and append menu container
	const menuContainer = document.createElement('div');
	menuContainer.className = 'menu-container';

	//iterate through each section in the data
	data.sections.forEach(section => {
		const sectionDiv = document.createElement('div') //create a div for each section
		sectionDiv.className = 'menu-section';
		sectionDiv.contentEditable = 'true';

		// cfeate and append section title
		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = section.title;
		sectionDiv.appendChild(sectionTitle);

		//create and append items list
		const ul = document.createElement('ul');
		section.items.forEach(item => { //in the section, iterate through the items
			const li = document.createElement('li');
			li.innerHTML = `${item.name} <span>${item.price}</span>`;
			ul.appendChild(li);
		});

		sectionDiv.appendChild(ul);
		menuContainer.appendChild(sectionDiv);
	});

	template.appendChild(menuContainer);
}

// serialize html content to json
function serializeCateringHTMLtoJSON() {
	const template = document.getElementById('template');
	const sections = template.querySelectorAll('.menu-section');

	//store title and sections in a dict format(json Data)
	const jsonData = {
		"title": document.title;
		"sections": []
	};

	// iterate over .menu-section - each section
	sections.forEach(section => {
		const sectionData = {
			"title": section.querySelector('h2').textContent,
			"items": []
		};
		// iterate over items in each section
		const items = section.querySelectorAll('ul li');
		items.forEach(item => {
			const name = item.textContent.replace(item.querySelector('span').textContent, '').trim();
			const price = item.querySelector('span').textContent.trim();
			sectionData.items.push({"name": name, "price": price});
		});
		// add sectionData to sections in jsonData
		jsonData.sections.push(sectionData);
	});
	//convert js object to a json string
	return JSON.stringify(jsonData);
}

function sendCateringDataToServer () {
	const jsonData = serializeCateringHTMLtoJSON();

	// link to server
	fetch(`/api/v1/customizations`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonData
	})
	.then(response => {
		if (response.ok) {
			console.log('Data sent successfully.');
		}
		else {
			console.error('Process Failed:', response.statusText);
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

// function to update existing customization
function updateCateringData(customizationId) {
	const jsonData = serializeCateringHTMLtoJSON();

	fetch(`/api/v1/customizations/${customizationId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(jsonData)
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
function deleteCateringData(customizationId) {
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

