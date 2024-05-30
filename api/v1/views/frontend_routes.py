from flask import Flask, render_template, request, jsonify
from api.v1.views import app_views


app = Flask(__name__)


@app_views.route('/menu2')
def menu2():
    """display other menu"""
    return render_template('menu_templates/restaurant.html')

@app_views.route('/menu3')
def menu3():
    """display third menu"""
    return render_template('wedding.html')

@app_views.route('/menu4')
def menu4():
    """catering menu"""
    return render_template('catering.html')

@app_views.route('/menu5')
def menu5():
    """pizza menu"""
    return render_template('pizza.html' )

@app_views.route('/createmenu')
def menuform():
    """provide a menu form to create a menu"""
    return render_template('create_template.html')



if __name__ == '__main__':
    app.run(debug=True)
