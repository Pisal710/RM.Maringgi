from flask import Flask, request, render_template, redirect, url_for, flash, session
from flask_bcrypt import Bcrypt
import os
from utils.register_user import register
from utils.login import login
from utils.order import save_order

app = Flask(__name__)
app.secret_key = os.urandom(24)
bcrypt = Bcrypt(app)

@app.route('/')
def root():
    return redirect(url_for('home_page'))       

@app.route("/login", methods=["GET", "POST"])
def login_page():
    #untuk debuggin
    #print("Form data:", request.form)
    #username = request.form.get('username')
    #password = request.form.get('password')
    #print("Username:", username)
    #print("Password:", password)

    if request.method == "GET":
        return render_template("login.html")
    
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not username or not password:
            flash("Username dan password harus diisi", "error")
            return render_template("login.html")
        
        data = login(username, password)
        
        if data:
            session['username'] = data.get('username')
            session['user_id'] = data.get('id')
            session['role'] = data.get('role')
            
            if data.get('role') == 'admin':
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('menu_page'))
        else:
            flash("Username atau password salah", "error")
            return render_template("login.html")
    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register_page():
    if request.method == "POST":
        email = request.form.get("email")
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not email or not username or not password:
            flash("Semua field harus diisi", "error")
            return render_template("register.html")
        
        success = register(email, username, password)
        
        if success:
            flash("Registrasi berhasil! Silakan login.", "success")
            return redirect(url_for("login_page"))
        
        flash("Registrasi gagal. Silakan coba lagi.", "error")
    return render_template("register.html")

@app.route("/admin", methods=["GET"])
def admin_dashboard():
    return render_template("admin_page.html")    

@app.route("/home", methods=["GET"])
def home_page():
    return render_template("home.html")

@app.route("/menu", methods=["GET", "POST"])
def menu_page():
    if request.method == "GET":
        return render_template("menu.html")
    elif request.method == "POST":
        if 'user_id' not in session:
            return {"success": False,"message":"Anda harus login terlebih dahulu","redirect": "/login"}

        data = request.get_json()
        if not data or 'items' not in data or 'subtotal' not in data:
            return {"success": False, "message": "Data pesanan tidak valid"}, 400

        user_id = session['user_id']
        items = data['items']
        subtotal = data['subtotal']

        success = save_order(user_id, items, subtotal)
        if success:
            return {"success": True, "message": "Pesanan berhasil disimpan!"}
        else:
            return {"success": False, "message": "Gagal menyimpan pesanan"}, 500
    return render_template("menu.html")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
