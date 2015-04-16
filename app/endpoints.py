from flask import render_template, request, redirect
from app import app
from app.models import Clicker

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/status.json')
def update():
    return Clicker.recent_clicker()



@app.route('/click', methods=['POST'])
def click_thebutton():
    button_click = request.get_json()
    if "username" not in button_click or Clicker.query.filter_by(username=button_click["username"]).first():
        # user with such a username already clicked
        return "User with such a name already exists"
    c = Clicker(
        username=button_click['username'],
        clicked=datetime.utcnow())
    db.session.add(c)
    db.session.commit()
    # FIXME: handle and report errors
    return ":)"
