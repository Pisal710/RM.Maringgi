from koneksi.koneksi import get_db_connection

def save_order(user_id, items, subtotal, delivery_info=None):
    with get_db_connection() as db:
        if db is None:
            return False

        cursor = None
        try:
            cursor = db.cursor()

            # Jika ada informasi pengiriman, buat query dengan kolom tambahan
            if delivery_info:
                query_order = """
                    INSERT INTO orders (user_id, subtotal, nama_penerima, no_hp, alamat_lengkap, latitude, longitude)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                # Ekstrak informasi lokasi jika tersedia
                lat = None
                lng = None
                alamat = delivery_info.get('alamat', '')

                if delivery_info.get('location'):
                    location_data = delivery_info.get('location')
                    # Pastikan nilai lat dan lng adalah numerik sebelum digunakan
                    try:
                        lat = float(location_data.get('lat')) if location_data.get('lat') is not None else None
                        lng = float(location_data.get('lng')) if location_data.get('lng') is not None else None
                    except (ValueError, TypeError):
                        lat = None
                        lng = None

                    # Jika alamat belum diisi, gunakan alamat dari lokasi
                    if not alamat and location_data.get('address'):
                        alamat = location_data.get('address', '')

                cursor.execute(query_order, (
                    user_id,
                    subtotal,
                    delivery_info.get('nama', ''),
                    delivery_info.get('hp', ''),
                    alamat,
                    lat,
                    lng
                ))
            else:
                # Query untuk order tanpa informasi pengiriman (takeaway)
                # Tapi tetap sertakan kolom-kolom baru dengan nilai NULL
                query_order = "INSERT INTO orders (user_id, subtotal, nama_penerima, no_hp, alamat_lengkap, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(query_order, (user_id, subtotal, None, None, None, None, None))

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
            if cursor:
                cursor.close()
