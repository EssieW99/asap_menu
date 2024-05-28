// wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	// selcet save button
	const saveButton = document.getElementById('saveButton');
	// add a click event listener 
	saveButton.addEventListener('click', () => {
		saveAsPdf();
	});

	function saveAsPdf() {
		// get jspdf class from jspdf namespace
		const { jsPDF } = window.jspdf;
		// create new jspdf instance
		const doc = new jsPDF();

		// use html2canvas to capture template content
		html2canvas(document.getElementById('template')).then(canvas => {
			// convert canvas to a data url
			const imageData = canvas.toDataURL('image/png');
			// set img width to that of an a4 page
			const imgWidth = 210;
			const pageHeight = 297;
			// set image height ptoportionately based on width
			const imgHeight = canvas.height * imgWidth / canvas.width;
			let heightLeft = imgHeight;
			// initialize position to keep track of vertical pos
			let pos = 0;
			// add first image segment to pdf document
			doc.addImage(imageData, 'PNG', 0, pos, imgWidth, imgHeight);
			heightLeft -= pageHeight;
			pos -= pageHeight;

			// add additional pages where necessary
			while (heightLeft > 0) {
				doc.addPage();
				doc.addImage(imageData, 'PNG', 0, pos, imgWidth, imgHeight);
				heightLeft -= pageHeight;
				pos -= pageHeight;
			}
			// save the pdf
			doc.save('template.pdf');
		});
	}
});
