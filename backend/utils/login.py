import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from koneksi.koneksi import get_db_connection
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def verify_password(stored_password, plain_password: str) -> bool:
    if isinstance(stored_password, bytes):
        stored_password = stored_password.decode('utf-8')
    else:
        stored_password = str(stored_password)
    return bcrypt.check_password_hash(stored_password, plain_password)


class Admin:
    def __init__(self, db_factory=lambda: get_db_connection().__enter__()):
        self._db_factory = db_factory

    def login(self, username: str, password: str):
        with get_db_connection() as db:
            if not username or not password or not db:
                return None

            cursor = None
            try:
                cursor = db.cursor()
                query = "SELECT id, username, password FROM admin_login WHERE username = %s"
                cursor.execute(query, (username,))
                row = cursor.fetchone()
                if not row or len(row) < 3:
                    return None

                user_id, user_username, stored_password = row

                if user_id and user_username and stored_password:
                    if verify_password(stored_password, password):
                        return {"id": user_id, "username": user_username, "role": "admin"}
                return None
            except Exception as e:
                print(f"Admin login error: {e}")
                return None
            finally:
                if cursor:
                    cursor.close()


class User:
    def login(self, username: str, password: str):
        with get_db_connection() as db:
            if not username or not password or not db:
                return None

            cursor = None
            try:
                cursor = db.cursor()
                query = "SELECT id, username, password FROM user_login WHERE username = %s"
                cursor.execute(query, (username,))
                row = cursor.fetchone()
                if not row or len(row) < 3:
                    return None

                user_id, user_username, stored_password = row

                if user_id and user_username and stored_password:
                    if verify_password(stored_password, password):
                        return {
                            "id": user_id,
                            "username": user_username,
                            "role":"user"
                        }
                return None
            except Exception as e:
                print(f"User login error: {e}")
                return None
            finally:
                if cursor:
                    cursor.close()


def login(username: str, password: str):
    with get_db_connection() as db:
        if not username or not password or not db:
            return None

        cursor = None
        try:
            cursor = db.cursor()

            cursor.execute("SELECT id, username, password FROM admin_login WHERE username = %s", (username,))
            row = cursor.fetchone()
            if row and len(row) >= 3:
                user_id, user_username, stored_password = row
                if user_id and user_username and stored_password:
                    if verify_password(stored_password, password):
                        return {"id": user_id, "username": user_username, "role": "admin"}

            cursor.execute("SELECT id, username, password FROM user_login WHERE username = %s", (username,))
            row = cursor.fetchone()
            if row and len(row) >= 3:
                user_id, user_username, stored_password = row
                if user_id and user_username and stored_password:
                    if verify_password(stored_password, password):
                        return {"id": user_id, "username": user_username, "role": "user"}

            return None
        except Exception as e:
            print(f"Login error: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
