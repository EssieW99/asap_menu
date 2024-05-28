from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/menu2')
def menu2():
    """display other menu"""
    return render_template('restaurant.html')

@app.route('/menu3')
def menu3():
    """display third menu"""
    return render_template('wedding.html')

@app.route('/menu4')
def menu4():
    """catering menu"""
    return render_template('catering.html')

@app.route('/menu5')
def menu5():
    """pizza menu"""
    return render_template('pizza.html' )

@app.route('/menu6')
def menu6():
    """pizza menu"""
    return render_template('example.html' )



if __name__ == '__main__':
    app.run(debug=True)
