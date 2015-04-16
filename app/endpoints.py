from flask import render_template, request, redirect, abort
from app import app, db
from app.models import Clicker
from app.utils import jsonify
from datetime import datetime

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/status.json')
def update():
    return Clicker.recent_clicker()



@app.route('/click', methods=['POST'])
def click_thebutton():
    button_click = request.get_json()
    if not button_click:
        return abort(400, 'Broken request: must send JSON with properties in the payload')
    if "username" not in button_click:
        return abort(400, 'Broken request: the JSON with props needs to have the submitted username')
    if Clicker.query.filter_by(username=button_click["username"]).first():
        return abort(400, 'Broken request: there was already a registered click with such a username')

    c = Clicker(
        username=button_click['username'],
        clicked=datetime.utcnow())
    db.session.add(c)
    db.session.commit()
    return c.to_dict()


@app.errorhandler(400)
def custom400(error):
    return jsonify({"error":error.description}), 400
