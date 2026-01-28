from pymongo import MongoClient
import time

client = MongoClient("mongodb://localhost:27017/")
db = client["certificate_db"]

admin_col = db["admins"]
cert_col = db["certificates"]

if admin_col.count_documents({}) == 0:
    admin_col.insert_one({
        "username": "admin",
        "password": "admin123",      
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
    })

cert_col.create_index("roll_no", unique=True)
cert_col.create_index("cert_id", unique=True)
