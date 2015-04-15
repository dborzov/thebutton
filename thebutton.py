from datetime import datetime

from flask import Flask, render_template, request, redirect
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import desc
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/update.json')
def update():
    last_click, last_clicker = get_last_click_and_clicker()
    delta = datetime.utcnow() - last_click
    return json.dumps({
        "lastClick": delta.seconds,
        "lastClicker": last_clicker
    })


@app.route('/click', methods=['POST'])
def click_thebutton():
    # FIXME: this doesn't work, accept any post for now
    if True or request.form['last_click'] == get_last_click():
        c = Clicker(
            username=request.form['username'],
            clicked=datetime.utcnow())
        db.session.add(c)
        db.session.commit()
    # FIXME: handle and report errors
    return redirect('/')


def get_last_click_and_clicker():
    """
    Return (last click time, username of last clicker)
    """
    last_clicker = Clicker.query.order_by(desc(Clicker.clicked)).first()
    if last_clicker is None:
        return start_time, None
    return last_clicker.clicked, last_clicker.username


class Clicker(db.Model):
    """
    Record the clicker's name and time they clicked the button
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    clicked = db.Column(db.DateTime)


if __name__ == '__main__':
    db.create_all()
    start_time = datetime.utcnow()
    app.run(debug=True)
