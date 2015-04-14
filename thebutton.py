from datetime import datetime

from flask import Flask, render_template, request, redirect
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import desc

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

@app.route('/')
def index():
    last_click = get_last_click()
    delta = datetime.utcnow() - last_click
    return render_template('index.html', **locals())

@app.route('/click', methods=['POST'])
def click_thebutton():
    if request.form['last_click'] == get_last_click():
        c = Clicker(
            username=request.form['username'],
            clicked=datetime.utcnow())
        db.session.add(c)
        db.session.commit()
    return redirect('/')


def get_last_click():
    last_clicker = Clicker.query.order_by(desc(Clicker.clicked)).first()
    if last_clicker is None:
        return start_time
    return last_clicker.clicked


class Clicker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    clicked = db.Column(db.DateTime)


if __name__ == '__main__':
    db.create_all()
    start_time = datetime.utcnow()
    app.run(debug=True)
