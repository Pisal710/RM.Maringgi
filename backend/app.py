import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, request, render_template, redirect, url_for, flash, session, jsonify
from flask_bcrypt import Bcrypt
from utils.register_user import register
from utils.login import login
from utils.order import save_order
from koneksi.koneksi import get_db_connection
from datetime import datetime
from typing import Any, Optional

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')
app.secret_key = os.urandom(24)
bcrypt = Bcrypt(app)

@app.route('/')
def root():
    return redirect(url_for('login_page'))

@app.route("/login", methods=["GET", "POST"])
def login_page():
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
                redirect_to = request.args.get('redirect', '/home')
                return redirect(redirect_to)
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

@app.route("/menu-view", methods=["GET"])
def menu_view():
    return render_template("menu.html")

@app.route("/menu", methods=["GET", "POST"])
def menu_page():
    if request.method == "GET":
        return render_template("menu.html")
    elif request.method == "POST":
        if 'user_id' not in session:
            data = request.get_json()
            if data and len(data.get('items', [])) == 0 and data.get('subtotal') == 0:
                return {"success": False, "message": "Anda harus login terlebih dahulu", "redirect": "/login"}
            return {"success": False, "message": "Anda harus login terlebih dahulu", "redirect": "/login"}

        data = request.get_json()
        if not data or 'items' not in data or 'total' not in data:
            return {"success": False, "message": "Data pesanan tidak valid"}, 400

        user_id = session['user_id']
        items = data['items']
        total = data['total']
        order_type = data.get('order_type', 'delivery')
        payment_method = data.get('payment_method', 'COD')
        payment_status = data.get('payment_status', 'Pending')
        virtual_account = data.get('virtual_account')
        delivery_info = data.get('delivery_info')

        success = save_order(user_id, items, total, order_type, payment_method, payment_status, virtual_account, delivery_info)
        if success:
            return {"success": True, "message": "Pesanan berhasil disimpan!"}
        else:
            return {"success": False, "message": "Gagal menyimpan pesanan"}, 500
    return render_template("menu.html")

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login_page'))

@app.route('/api/orders', methods=['GET'])
def get_orders():
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    try:
        with get_db_connection() as db:
            if db is None:
                return jsonify({"success": False, "message": "Database connection error"}), 500
                
            cursor = db.cursor()
            cursor.execute("""
                SELECT id, user_id, total_price, order_status, order_type, payment_method, payment_status, virtual_account, delivery_name, delivery_phone, delivery_address, created_at, updated_at
                FROM orders
                ORDER BY created_at DESC
                LIMIT 100
            """)
            orders: list[Any] = cursor.fetchall()
            cursor.close()
            
            orders_list: list[dict[str, Any]] = []
            if orders:
                for order in orders:
                    created_at = order[11]
                    updated_at = order[12]
                    orders_list.append({
                        'id': int(order[0]),
                        'user_id': int(order[1]),
                        'total_price': float(order[2]),
                        'order_status': str(order[3]),
                        'order_type': str(order[4]),
                        'payment_method': str(order[5]),
                        'payment_status': str(order[6]),
                        'virtual_account': str(order[7]) if order[7] else None,
                        'delivery_name': str(order[8]) if order[8] else None,
                        'delivery_phone': str(order[9]) if order[9] else None,
                        'delivery_address': str(order[10]) if order[10] else None,
                        'created_at': created_at.isoformat() if created_at else None,
                        'updated_at': updated_at.isoformat() if updated_at else None,
                    })
            
            return jsonify({"success": True, "orders": orders_list})
    
    except Exception as e:
        print(f"Error fetching orders: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order_detail(order_id: int):
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    try:
        with get_db_connection() as db:
            if db is None:
                return jsonify({"success": False, "message": "Database connection error"}), 500
                
            cursor = db.cursor()
            cursor.execute("""
                SELECT id, user_id, total_price, order_status, order_type, payment_method, payment_status, virtual_account, delivery_name, delivery_phone, delivery_address, created_at, updated_at
                FROM orders
                WHERE id = %s
            """, (order_id,))
            order: Any = cursor.fetchone()
            
            if not order:
                return jsonify({"success": False, "message": "Order not found"}), 404
            
            created_at = order[11]
            updated_at = order[12]
            order_dict: dict[str, Any] = {
                'id': int(order[0]),
                'user_id': int(order[1]),
                'total_price': float(order[2]),
                'order_status': str(order[3]),
                'order_type': str(order[4]),
                'payment_method': str(order[5]),
                'payment_status': str(order[6]),
                'virtual_account': str(order[7]) if order[7] else None,
                'delivery_name': str(order[8]) if order[8] else None,
                'delivery_phone': str(order[9]) if order[9] else None,
                'delivery_address': str(order[10]) if order[10] else None,
                'created_at': created_at.isoformat() if created_at else None,
                'updated_at': updated_at.isoformat() if updated_at else None,
            }
            
            cursor.execute("""
                SELECT id, order_id, food_id, quantity, price, created_at
                FROM order_items
                WHERE order_id = %s
            """, (order_id,))
            items: list[Any] = cursor.fetchall()
            items_list: list[dict[str, Any]] = []
            if items:
                for item in items:
                    item_created_at = item[5]
                    items_list.append({
                        'id': int(item[0]),
                        'order_id': int(item[1]),
                        'food_id': int(item[2]),
                        'quantity': int(item[3]),
                        'price': float(item[4]),
                        'created_at': item_created_at.isoformat() if item_created_at else None,
                    })
            
            cursor.close()
            
            return jsonify({
                "success": True,
                "order": order_dict,
                "items": items_list
            })
    
    except Exception as e:
        print(f"Error fetching order detail: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/orders/<int:order_id>/confirm', methods=['PUT'])
def confirm_order(order_id: int):
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    try:
        with get_db_connection() as db:
            if db is None:
                return jsonify({"success": False, "message": "Database connection error"}), 500
                
            cursor = db.cursor()
            cursor.execute("""
                UPDATE orders
                SET order_status = 'confirmed', updated_at = NOW()
                WHERE id = %s
            """, (order_id,))
            db.commit()
            cursor.close()
            
            return jsonify({"success": True, "message": "Order confirmed"})
    
    except Exception as e:
        print(f"Error confirming order: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/orders/<int:order_id>/cancel', methods=['PUT'])
def cancel_order(order_id: int):
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    try:
        with get_db_connection() as db:
            if db is None:
                return jsonify({"success": False, "message": "Database connection error"}), 500
                
            cursor = db.cursor()
            cursor.execute("""
                UPDATE orders
                SET order_status = 'cancelled', updated_at = NOW()
                WHERE id = %s
            """, (order_id,))
            db.commit()
            cursor.close()
            
            return jsonify({"success": True, "message": "Order cancelled"})
    
    except Exception as e:
        print(f"Error cancelling order: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/customers', methods=['GET'])
def get_customers():
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    try:
        with get_db_connection() as db:
            if db is None:
                return jsonify({"success": False, "message": "Database connection error"}), 500
                
            cursor = db.cursor()
            cursor.execute("""
                SELECT id, email, username, created_at
                FROM user_login
                ORDER BY created_at DESC
                LIMIT 100
            """)
            customers: list[Any] = cursor.fetchall()
            cursor.close()
            
            customers_list: list[dict[str, Any]] = []
            if customers:
                for customer in customers:
                    created_at = customer[3]
                    customers_list.append({
                        'id': int(customer[0]),
                        'email': str(customer[1]),
                        'username': str(customer[2]),
                        'created_at': created_at.isoformat() if created_at else None,
                    })
            
            return jsonify({"success": True, "customers": customers_list})
    
    except Exception as e:
        print(f"Error fetching customers: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/orders/delete-all', methods=['DELETE'])
def delete_all_orders():
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    try:
        with get_db_connection() as db:
            if db is None:
                return jsonify({"success": False, "message": "Database connection error"}), 500
                
            cursor = db.cursor()
            cursor.execute("DELETE FROM order_items")
            cursor.execute("DELETE FROM orders")
            
            db.commit()
            cursor.close()
            
            return jsonify({"success": True, "message": "All orders deleted successfully"})
    
    except Exception as e:
        print(f"Error deleting all orders: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
