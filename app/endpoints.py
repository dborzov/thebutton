from flask import render_template, request, redirect, abort, jsonify
from datetime import datetime
from sqlalchemy import desc

from app import app, db
from app.models import ShortenedURL
from app.utils import jsonify


@app.route('/')
def index():
    return render_template('index.html')



@app.route('/router/<hash>', methods=['GET'])
def router(hash):
    router = ShortenedURL.query.filter_by(uri_hash=hash).first()
    if router:
        return redirect(router.src_url)
    else:
        abort(404)

@app.route('/shorted_url', methods=['PUT'])
def assigner():
    payload = request.get_json(force=True)
    new_SURL = ShortenedURL(src_url = payload["URL"])
    db.session.add(new_SURL)
    db.session.commit()
    return jsonify(new_SURL.to_dict())
