from datetime import datetime
from sqlalchemy import desc
import json

from app import db


class Clicker(db.Model):
    """
    Record the clicker's name and time they clicked the button
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    clicked = db.Column(db.DateTime)


    def to_dict(self):
        delta = datetime.utcnow() - self.clicked
        return json.dumps({
            "lastClick": delta.seconds,
            "lastClicker": self.username
        })


    @staticmethod
    def recent_clicker():
        recent = Clicker.query.order_by(desc(Clicker.clicked)).first()
        if recent is None:
            return {}
        return recent.to_dict()
