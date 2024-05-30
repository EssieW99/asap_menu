document.getElementById('templateform').addEventListener('submit', function(event) {
	const formElement = event.target;
	const formData = new FormData(formElement);

	createTemplate(formData);
});

let templateId;

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
		templateId = data.template_id;
		console.log('New template created:', data);
	})
	.catch(error => {
		console.error('Error creating template:', error);
	});
}

// Function to get a template by ID
function getTemplate(templateId) {
	fetch(`/api/v1/templates/${templateId}`)
	.then(response => {
		if (!response.ok) {
			console.error('Failed to fetch template:');
	        }
	        return response.json();
	})
	.then(data => {
		console.log('Template:', data);
	})
	.catch(error => {
		console.error('Error fetching template:', error);
	});
}

// Function to get all templates
function getAllTemplates() {
	fetch(`/api/v1/templates`)
	.then(response => {
		if (!response.ok) {
			console.error('Failed to fetch templates:');
		}
	        return response.json();
	})
	.then(data => {
		console.log('All templates:', data);
	})
	.catch(error => {
		console.error('Error fetching templates:', error);
	});
}

const newData = document.getElementById('template').textContent;

// Function to update a template
function updateTemplate(templateId, newData) {
	fetch(`/api/v1/templates/${templateId}`, {
		method: 'PUT',
	        headers: {
			'Content-Type': 'application/json'
		},
		body: newData
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
