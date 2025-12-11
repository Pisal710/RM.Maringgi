from koneksi.koneksi import koneksi_db

def save_order(user_id, items, subtotal):
    db = koneksi_db()
    if db is None:
        return False

    cursor = None
    try:
        cursor = db.cursor()

        # Simpan ke tabel orders
        query_order = "INSERT INTO orders (user_id, subtotal) VALUES (%s, %s)"
        cursor.execute(query_order, (user_id, subtotal))
        order_id = cursor.lastrowid

        query_item = """
            INSERT INTO order_items (order_id, menu_id, nama, harga, jumlah)
            VALUES (%s, %s, %s, %s, %s)
        """
        for item in items:
            cursor.execute(query_item, (
                order_id,
                item.get("id"),
                item.get("nama"),
                item.get("harga"),
                item.get("jumlah")
            ))

        db.commit()
        return True
    except Exception as e:
        print(f"Error saving order: {e}")
        db.rollback()
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
