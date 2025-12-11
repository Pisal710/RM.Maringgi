import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from koneksi.koneksi import*
from flask_bcrypt import Bcrypt


db = koneksi_db()
bcrypt = Bcrypt()

def register(email,username,password):
    if db is None:
        return False

    cursor = None
    try:
        cursor = db.cursor()
        query = "INSERT INTO user_login (email, username, password) VALUES (%s, %s, %s)"
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        cursor.execute(query, (email, username, hashed_password))
        db.commit()
        return True
    except Exception:
        return False
    finally:
        try:
            if cursor:
                cursor.close()
        except Exception:
            pass
        try:
            if db:
                db.close()
        except Exception:
            pass

if __name__== "__main__":
    pass
