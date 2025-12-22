import mysql.connector
import os
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

@contextmanager
def get_db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        yield conn
    except mysql.connector.Error as err:
        if err.errno == 2003:
            print(f"Error: Tidak bisa terhubung ke host '{os.getenv('DB_HOST')}'")
        elif err.errno == 1045:
            print(f"Error: Username atau password salah")
        elif err.errno == 1049:
            print(f"Error: Database '{os.getenv('DB_NAME')}' tidak ditemukan")
        else:
            print(f"Error: {err}")
        yield None
    finally:
        if conn and conn.is_connected():
            conn.close()

def koneksi_db():
    try:
        db = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        return db
    except mysql.connector.Error as err:
        if err.errno == 2003:
            print(f"Error: Tidak bisa terhubung ke host '{os.getenv('DB_HOST')}'")
        elif err.errno == 1045:
            print(f"Error: Username atau password salah")
        elif err.errno == 1049:
            print(f"Error: Database '{os.getenv('DB_NAME')}' tidak ditemukan")
        else:
            print(f"Error: {err}")
        return None

if __name__ == "__main__":
    db = koneksi_db()
    if db and db.is_connected():
        print("Koneksi Berhasil")
        db.close()
    else:
        print(" Koneksi Gagal")