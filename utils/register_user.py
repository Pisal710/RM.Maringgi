import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from koneksi.koneksi import get_db_connection
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def register(email, username, password):
    with get_db_connection() as db:
        if db is None:
            return False

        cursor = None
        try:
            cursor = db.cursor()
            # Check if username or email already exists
            check_query = "SELECT id FROM user_login WHERE username = %s OR email = %s"
            cursor.execute(check_query, (username, email))
            existing_user = cursor.fetchone()

            if existing_user:
                print("Username or email already exists")
                return False

            query = "INSERT INTO user_login (email, username, password) VALUES (%s, %s, %s)"
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            cursor.execute(query, (email, username, hashed_password))
            db.commit()
            return True
        except Exception as e:
            print(f"Error during registration: {e}")
            return False
        finally:
            if cursor:
                cursor.close()

if __name__== "__main__":
    pass
