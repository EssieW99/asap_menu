const contentContainer = document.getElementById('content-container');
const templateSelect = document.getElementById('template-select');
const downloadButton = document.getElementById('download-button');
const fontSelect = document.getElementById('font-select');
const sendToServer = document.getElementById('sendToServer');
const deleteButton = document.getElementById('deleteButton');

let customizationData = null;


templateSelect.addEventListener('change', () => {
	const selectedTemplate = templateSelect.value + '.html';
	contentContainer.innerHTML = ''; //clear previous content

	fetch(`/api/v1/templates/menu_templates/${selectedTemplate}`)
	    .then(response => {
		    if (!response.ok) {
			    throw new Error('Network response was not ok');
		    }
		    return response.text();
	    })
	    .then(templateHTML => {
		    contentContainer.innerHTML = templateHTML; //save the text
		    applySelectedFont();
		    loadTemplateCSS(selectedTemplate);
	    })
	    .catch(error => {
		    console.error('Error fetching template:', error);
	    });
});


function loadTemplateCSS(templateName) {
	// create a link element to get the css ie how do we import the css
	const link = document.createElement('link');//whats contained in a link element?
	link.href = `/api/v1/static/${templateName.replace('.html', '.css')}`;//change the extension to .css
	link.rel = "stylesheet";
	link.onload = () => {
		console.log('css loaded');
	};
	link.onerror = () => {
		console.error('error loading CSS');
	};
	document.head.appendChild(link);
}


sendToServer.addEventListener('click', () => {
	customizationData = contentContainer.innerHTML;
	const data = {
		customization_data: customizationData,
	};
	fetch(`/api/v1/customizations`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	})
	.then(response => {
		if (response.ok) {
			console.log('customization created successfully');
			return response.json();
			//downloadButton.disabled = false; //enable button for download
			//deleteButton.disabled = false; //enable button for delete
		}
		else {
			console.error('customization failed:', error);
			alert('An error occurred creating customization');
		}
	})
	.then(data => {
		const customizationId = data.id;
		alert('customization created successfully');
	})
	.catch(error => {
		console.error('Error sending request:', error);
	});
});


function getCustomization(customizationId) {
	fetch(`/api/v1/customizations/${customizationId}`, {
		method: 'GET',
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		else {
			throw new Error('Failed to get customization');
		}
	})
	.then(data => {
		contentContainer.innerHTML = '';
		const templateContent = data.customization_data; //access content from data object
		contentContainer.innerHTML = templateContent; //assign the data to the template
	})
	.catch(error => {
		console.error('Error fetching customization:', error);
	});
}

function getAllCustomizations() {
	fetch(`/api/v1/customizations`, {
		method: 'GET',
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		else {
			throw new Error('failed to fetch customizations');
		}
	})
	.then(data => {
		console.log('Fetched all customizations:', data);
		contentContainer.innerHTML = '';

		data.forEach(customization => {
			const customizationElement = document.createElement('pre');
			customizationElement.textContent = JSON.stringify(customization);
			contentContainer.appendChild(customizationElement);
		})
	})
	.catch(error => {
		console.error('Error getting customizations:', error);
	});
}

function updateCustomization(customizationId, formData) {
	const contentText = contentContainer.textContent.trim();
	formData = { customization_data: contentText };

	fetch(`/api/v1/customizations/${customizationId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formData),
	})
	.then(response => response.json())
	.then(data => {
		console.log('Customization updated:', data);
		const contentElement = document.createElement('div');
		contentElement.textContent = data.customization_data;

		contentContainer.innerHTML= '';
		contentContainer.appendChild(contentElement);// update user interface
	})
	.catch(error => {
		console.error('Error updating customization:', error);
	});
}


deleteButton.addEventListener('click', () => {
	fetch(`/api/v1/customizations/${customizationId}`, {
		method: 'DELETE',
	})
	.then(response => {
		if (response.ok) {
			console.log('Customization deleted successfully');
		}
		else {
			console.error('Error deleting customization:', error);
		}
	})
	.catch(error => {
		console.error('Error sending request:', error);
	});
});


downloadButton.addEventListener('click', () => {
	html2canvas(contentContainer).then(canvas => {
		//get data url from canvas
		const dataURL = canvas.toDataURL('image/png');

		//download  using given url
		const link = document.createElement('a');
		link.href = dataURL;
		link.download = 'menu_template.png';

		link.click();
	})
	.catch(error => {
		console.error('Error capturing the content:', error)
	});
});

fontSelect.addEventListener('change', applySelectedFont);


function applySelectedFont() {
	const selectedFont = fontSelect.value;
	contentContainer.style.fontFamily = selectedFont;
}
