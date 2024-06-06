document.addEventListener('DOMContentLoaded', function() {
	const templateForm = document.getElementById('templateForm');
	templateForm.addEventListener('submit', function(event) {
		event.preventDefault();

		const formElement = event.target;
		const formData = new FormData(formElement);

		//if (templateId) {
		//	updateTemplate(templateId, formData);
		//}
		//else {
		createTemplate(formData)
		//	.then(data => {
		//		console.log('New template created:', data);
		//	})
		//	.catch(error => {
		//		console.error('Error creating template:', error);
		//	});
		//}
	});
});


//function to create a new template
function createTemplate(formData) {
	// Function to create a new template
	fetch(`/api/v1/templates`, {
		method: 'POST',
		body: formData
	})
	.then(response => {
		if (!response.ok) {
			throw new error('Failed to create template');
	        }
	        return response.json();
	})
	.then(data => {
		console.log('New template created:', data);
		if (data.id) {
			const templateId = data.id;
			window.location.href = `/api/v1/templates/${templateId}`;
		}
		else {
			console.error('Missing template Id')
		}
	})
	.catch(error => {
		console.error('Error creating template:', error);
	});
}

// Function to get a template by ID
function getTemplate(templateId) {
	fetch(`/api/v1/templates/${templateId}`, { method: 'GET' })
	.then(response => {
		if (!response.ok) {
			console.error('Failed to fetch template:');
	        }
	        return response.json();
	})
	.then(data => {
		console.log('Template:', data);

		//update UI elements
		const templateName = document.getElementById('templateName')
		const templateDescription = document.getElementById('templateDescription');
		const thumbnail = document.getElementById('thumbnail');
		const templateFile = document.getElementById('templateFile');

		if (templateName) {
			templateName.textContent = data.name;
		}
		if (templateDescription) {
			templateDescription.textContent = data.description || '';
		}
		if (thumbnail) {
			thumbnail.src = data.thumbnail_url;
		}
		if (templateFile) {
			templateFile.href = data.template_url;
		}
	})
	.catch(error => {
		console.error('Error fetching template:', error);
	});
}

//Function to get all templates
function getAllTemplates() {
	fetch(`/api/v1/templates`, { method: 'GET' })
	.then(response => {
		if (!response.ok) {
			console.error('Failed to fetch templates:');
		}
	        return response.json();
	})
	.then(data => {
		console.log('All templates:', data);
		const templateList = document.getElementById('templateList');
		if (templateList) {
			templateList.innerHTML() = '';
			for (const template of data) {
				const listItem = document.createElement('li');
				listItem.textContent = `${template.id} ${template.name} - ${template.description || 'No description'}`;
				templateList.appendChild(listItem);
			}
		}
	})
	.catch(error => {
		console.error('Error fetching templates:', error);
	});
}


// Function to update a template
function updateTemplate(templateId, formData) {
	fetch(`/api/v1/templates/${templateId}`, {
		method: 'PUT',
	        body: formData
	})
	.then(response => {
		if (!response.ok) {
			console.error('Failed to update template');
		}
                return response.json();
	})
	.then(data => {
		console.log('Template updated:', data);
	})
	.catch(error => {
		console.error('Error updating template:', error);
	});
}

// Function to delete a template
function deleteTemplate(templateId) {
	fetch(`/api/v1/templates/${templateId}`, {
		method: 'DELETE'
	})
	.then(response => {
		if (!response.ok) {
			console.error('Failed to delete template');
		}
		console.log('Template deleted');
	})
	.catch(error => {
		console.error('Error deleting template:', error);
	});
}
