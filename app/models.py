from datetime import datetime
from sqlalchemy import desc
import json
import random

from app import db

URLLENGTH = 256
HASHLENGTH = 30
HASH_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

class ShortenedURL(db.Model):
    """
    Record the clicker's name and time they clicked the button
    """
    id = db.Column(db.Integer, primary_key=True)

    src_url = db.Column(db.String(URLLENGTH), unique=True)
    uri_hash = db.Column(db.String(HASHLENGTH), unique=True)

    def __init__(self, src_url=None):
        while True:
            hash = "".join([random.choice(HASH_CHARACTERS) for _ in range(6)])
            if not ShortenedURL.query.filter_by(uri_hash=hash).first():
                break
        self.src_url = src_url
        self.uri_hash = hash

    def to_dict(self):
        return {
            "src_url": self.src_url,
            "uri_hash": self.uri_hash
        }
