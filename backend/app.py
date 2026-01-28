from flask import Flask, request, jsonify, session
from flask_cors import CORS
from blockchain import Blockchain
from db import admin_col, cert_col
import uuid
import time
import os

app = Flask(__name__)
app.secret_key = "your-fixed-secret-key-2026"  
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'   
app.config['SESSION_COOKIE_HTTPONLY'] = False   # 

CORS(app, 
     supports_credentials=True,
     origins=['http://localhost:3000'],  
     allow_headers=['Content-Type', 'Authorization'])

blockchain = Blockchain()

@app.route('/api/session-status')
def session_status():
    return jsonify({'isLoggedIn': 'admin' in session})

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    admin = admin_col.find_one({"username": username, "password": password})
    
    if admin:
        session['admin'] = username
        session.modified = True  
        print(f"LOGIN SUCCESS: {username}")  
        return jsonify({'success': True, 'message': 'Login successful'})
    print(f"LOGIN FAILED: {username}")  
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

@app.route('/api/certificates')
def get_certificates():
    print(f"🔍 Session check: {'admin' in session}")  
    if 'admin' not in session:
        return jsonify({'error': 'Unauthorized - No session'}), 401
    
    certificates = list(cert_col.find({}, {"_id": 0}).sort("issued_at", -1))
    return jsonify(certificates)

@app.route('/api/all-ids')
def get_all_ids():
    if 'admin' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    cert_ids = list(cert_col.find({}, {"cert_id": 1, "issued_at": 1, "_id": 0}).sort("issued_at", -1))
    return jsonify(cert_ids)

@app.route('/api/issue', methods=['POST', 'OPTIONS'])
def issue_certificate():
    if request.method == 'OPTIONS':
        return '', 200
        
    if 'admin' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    student_name = data.get('name', '').strip()
    roll_no = data.get('roll', '').strip()
    degree = data.get('degree', '').strip()
    university = data.get('university', '').strip()
    year = data.get('year', '').strip()

    if not all([student_name, roll_no, degree, university, year]):
        return jsonify({'error': 'All fields are required'}), 400

    if cert_col.find_one({"roll_no": roll_no}):
        return jsonify({'error': f'Certificate already exists for Roll No {roll_no}'}), 400

    cert_id = str(uuid.uuid4())[:8].upper()
    cert_data = {
        "cert_id": cert_id,
        "student_name": student_name,
        "roll_no": roll_no,
        "degree": degree,
        "university": university,
        "year": year,
        "issued_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "issuer": session['admin']
    }

    block_hash = blockchain.add_block(cert_data.copy())
    cert_data["block_hash"] = block_hash
    cert_col.insert_one(cert_data)
    
    return jsonify({
        'success': True, 
        'message': f'Certificate {cert_id} issued successfully',
        'cert_id': cert_id, 
        'block_hash': block_hash
    })

@app.route('/api/verify/<cert_id>')
def verify_certificate(cert_id):
    doc = cert_col.find_one({"cert_id": cert_id})
    if doc:
        doc.pop('_id', None)
        return jsonify(doc)
    return jsonify({'error': 'Certificate not found'}), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
