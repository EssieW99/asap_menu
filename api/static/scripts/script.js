document.getElementById('edit-form').addEventListener('submit', function(event) {
    
	const itemId = parseInt(document.getElementById('item-id').value);
	const itemTitle = document.getElementById('item-title').value;
	const itemDescription = document.getElementById('description').value;
	const itemPrice = parseFloat(document.getElementById('item-price').value).toFixed(2);

	fetch('/menu/update', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: itemId,
			title: itemTitle,
			description: itemDescription,
			price: itemPrice
		})
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			const menuItem = document.querySelector(`.menu-item[data-item-id="${itemId}"]`);
			if (menuItem) {
				menuItem.querySelector('h3').innerText = itemTitle;
				menuItem.querySelector('p').innerText = itemDescription;
				menuItem.querySelector('span').innerText = `$${itemPrice}`;
			}
		}
		else {
			alert('Item not found');
		}
	});
});
