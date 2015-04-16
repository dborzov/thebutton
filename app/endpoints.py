from flask import render_template, session, request, redirect, abort
from datetime import datetime
from sqlalchemy import desc

from app import app, db
from app.models import Clicker
from app.utils import jsonify


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/status.json')
def update():
    status = {}
    status["mostRecentClick"] = Clicker.recent_clicker().to_dict()
    status["leaderboard"] = [cl.to_dict() for cl in Clicker.query.order_by(desc(Clicker.score)).all()]
    if "username" in session:
        status["alreadyClicked"] = True
        status["username"] = session["username"]
        status["score"] = session["score"]
    return jsonify(status)



@app.route('/click', methods=['POST'])
def click_thebutton():
    button_click = request.get_json()
    if not button_click:
        return abort(400, 'Broken request: must send JSON with properties in the payload')
    if "username" not in button_click or \
        not isinstance(button_click['username'], (str, unicode)) or\
        len(button_click['username']) == 0:
        return abort(400, 'Broken request: the JSON does not seem to be formatted properly')
    if Clicker.query.filter_by(username=button_click["username"]).first():
        return abort(400, 'Broken request: there was already a registered click with such a username')

    prev = Clicker.recent_clicker()
    now = datetime.utcnow()
    timediff = now - prev.clicked
    c = Clicker(
        username = button_click['username'],
        clicked = now,
        score = timediff.seconds)
    db.session.add(c)
    db.session.commit()

    session["already_clicked"] = True
    session["username"] = button_click['username']
    session["score"] = timediff.seconds
    return jsonify(c.to_dict())


@app.errorhandler(400)
def custom400(error):
    return jsonify({"error":error.description}), 400
