document.addEventListener('DOMContentLoaded', (event) => {
	// function to handle the click event
	function thumbnailClick(event) {
		//get the id att of clicked thumbnail
		const thumbnailId = event.getAttribute('data-id');
		// construct url for customization page
		const customizationPageUrl = `/customize?id=${thumbnailId}`;
		// redirect to customization page
		windows.location.href = customizationPageUrl;
	}
	//get all thumbnails
	const thumbnails = document.querySelectorAll('.thumbnail');

	thumbnails.forEach(thumbnail => {
		thumbnail.addEventListener('click', thumbnailClick);
	});
});
