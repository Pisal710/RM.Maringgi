import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from koneksi.koneksi import koneksi_db as connect_db
from flask_bcrypt import Bcrypt

class Admin:
    bcrypt = Bcrypt()
    def __init__(self, db_factory=connect_db, bcrypt=None):
        self._db_factory = db_factory
        self._bcrypt = bcrypt

    def login(self, username: str, password: str):
        if not username or not password:
            return None

        db = self._db_factory()
        if not db:
            return None

        cursor = None
        try:
            cursor = db.cursor()
            query = "SELECT id, username, password FROM admin_login WHERE username = %s"
            cursor.execute(query, (username,))
            row = cursor.fetchone()
            if not row:
                return None

            user_id, user_username, stored_password = row[0], row[1], row[2]
            if stored_password == password:
                return {"id": user_id, "username": user_username}
            return None
        except Exception:
            return None
        finally:
            try:
                if cursor:
                    cursor.close()
            except Exception:
                pass
            try:
                db.close()
            except Exception:
                pass
class User:
    def __init__(self, db_factory=connect_db, bcrypt=None):
        self._db_factory = db_factory
        self._bcrypt = bcrypt

    def login(self, username: str, password: str):
        if not username or not password:
            return None

        db = self._db_factory()
        if not db:
            return None

        cursor = None
        try:
            cursor = db.cursor()
            query = "SELECT id, username, password FROM user_login WHERE username = %s"
            cursor.execute(query, (username,))
            row = cursor.fetchone()
            if not row:
                return None

            user_id, user_username, hashed_password = row[0], row[1], row[2]
            if self._bcrypt and self._bcrypt.check_password_hash(hashed_password, password):
                return {"id": user_id, "username": user_username}
            return None
        except Exception:
            return None
        finally:
            try:
                if cursor:
                    cursor.close()
            except Exception:
                pass
            try:
                db.close()
            except Exception:
                pass

def login(username: str, password: str):
    db = connect_db()
    if not db:
        return None
    
    try:
        cursor = db.cursor()
        
        cursor.execute("SELECT id, username, password FROM admin_login WHERE username = %s", (username,))
        row = cursor.fetchone()
        if row:
            user_id, user_username, stored_password = row
            if stored_password == password:
                return {"id": user_id, "username": user_username, "role": "admin"}
            
        cursor.execute("SELECT id, username, password FROM user_login WHERE username = %s", (username,))
        row = cursor.fetchone()
        if row:
            user_id, user_username, hashed_password = row
            bcrypt_inst = Bcrypt()
            if bcrypt_inst.check_password_hash(hashed_password, password):
                return {"id": user_id, "username": user_username, "role": "user"}
        
        return None
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    pass