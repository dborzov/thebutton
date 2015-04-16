from app import app, db
from app.models import Clicker


if __name__ == '__main__':
    Clicker.initialize_db()
    app.run(debug=True)
