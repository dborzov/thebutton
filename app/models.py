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

    # score is the number of seconds since the previous click by some other user
    score = db.Column(db.Integer)


    def to_dict(self):
        return {
            "score": self.score,
            "name": self.username
        }


    @staticmethod
    def recent_clicker():
        recent = Clicker.query.order_by(desc(Clicker.clicked)).first()
        if recent is None:
            return {}
        return recent

    @staticmethod
    def initialize_db():
        """
        The click stores score, which is the number of seconds since the preivous click.
        There is a previous click for every new click except the very first one.
        Rather than worrying about this special case, we just populate the db
        with the special "Button started" click when the db is initialized.
        """
        db.create_all()
        if len(Clicker.query.all()) !=0:
            return

        first_entry = Clicker(
            username = "The Button created",
            score = 0,
            clicked = datetime.utcnow())
        db.session.add(first_entry)
        db.session.commit()
        return first_entry
