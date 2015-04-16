"""
    Initialize the Flask app
"""

from flask import Flask, render_template, request, redirect
from flask.ext.sqlalchemy import SQLAlchemy
from secrets import SECRET_KEY

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.secret_key = SECRET_KEY
db = SQLAlchemy(app)

import endpoints