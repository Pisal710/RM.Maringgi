from koneksi.koneksi import get_db_connection

def save_order(user_id, items, total, order_type='delivery', payment_method='COD', payment_status='Pending', virtual_account=None, delivery_info=None):
    with get_db_connection() as db:
        if db is None:
            return False

        cursor = None
        try:
            cursor = db.cursor()
            query_order = """
                INSERT INTO orders 
                (user_id, total_price, order_status, order_type, payment_method, payment_status, virtual_account, delivery_name, delivery_phone, delivery_address, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """
            
            delivery_name = None
            delivery_phone = None
            delivery_address = None
            
            if delivery_info and isinstance(delivery_info, dict):
                delivery_name = delivery_info.get('nama')
                delivery_phone = delivery_info.get('hp')
                delivery_address = delivery_info.get('alamat')
            
            cursor.execute(query_order, (
                user_id,
                total,
                'pending',
                order_type,
                payment_method,
                payment_status,
                virtual_account,
                delivery_name,
                delivery_phone,
                delivery_address
            ))
            
            order_id = cursor.lastrowid
            
            if items and isinstance(items, list):
                query_items = """
                    INSERT INTO order_items (order_id, food_id, quantity, price)
                    VALUES (%s, %s, %s, %s)
                """
                
                for item in items:
                    item_id = item.get('id')
                    item_qty = item.get('jumlah', 1)
                    item_price = item.get('harga', 0)
                    
                    cursor.execute(query_items, (order_id, item_id, item_qty, item_price))
            
            db.commit()
            print(f"Order {order_id} successfully saved for user {user_id}")
            return True
            
        except Exception as e:
            print(f"Error saving order: {e}")
            if db:
                db.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
