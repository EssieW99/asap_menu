from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)

menu_data = {
        "hotel_name": "",
        "main_dish": "",
        "description": "",
        "image_url": "",
        "price": "$",
        "side_dishes": [],
        "famous_food_quotes": "",
        "email": ""
}


@app.route('/menu')
def menu():
    """display current menu"""
    return render_template('menu1.html', **menu_data)


@app.route('/menu/update', methods=['GET', 'POST'])
def update_menu():
    """allows for menu update"""
    if request.method == 'POST':
        menu_data["hotel_name"] = request.form['hotel_name']
        menu_data["main_dish"] = request.form['main_dish']
        menu_data["description"] = request.form['description']
        menu_data["image_url"] = request.form['image_url']
        menu_data["price"] = request.form['price']

        """collect side dishes"""
        side_dishes = []
        for i in range(10):
            food = request.form.get(f'side_food{i}')
            price = request.form.get(f'side_price{i}')
            if food and price:
                side_dishes.append({"food": food, "price": price})
        menu_data["side_dishes"] = side_dishes

        response = requests.get("http://quotes.rest/qod.json?category=inspire")
        if response.status_code == 200:
            data = response.json()
            menu_data["famous_food_quotes"] = data['contents']['quotes'][0]['quote']
        else:
            menu_data["famous_food_quotes"] = \
                    "It's never a dull day to treat yourself"

        menu_data["email"] = request.form['email']

        return redirect(url_for('menu'))

    return render_template('update_menu.html')


if __name__ == '__main__':
    app.run(debug=True)
