from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mi_clave_super_secreta'
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Admin123",
    database="digital_solutions"
)

# LOGIN
@app.route('/login', methods=['POST'])
def login():

    data = request.json
    email = data['email']
    password = data['password']

    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM usuarios WHERE email=%s"
    cursor.execute(query,(email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):

        token = jwt.encode({
            "user_id": user["id"],
            "email": user["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({
            "message":"Login exitoso",
            "token": token
        })

    else:

        return jsonify({"message":"Credenciales incorrectas"}),401


# REGISTRO
@app.route('/registro', methods=['POST'])
def registro():

    data = request.json
    nombre = data['nombre']
    email = data['email']
    password = data['password']

    # 🔐 encriptar contraseña con bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor = db.cursor()

    query = "INSERT INTO usuarios (nombre,email,password) VALUES (%s,%s,%s)"
    cursor.execute(query,(nombre,email,hashed_password))

    db.commit()

    return jsonify({"message":"Usuario registrado"})


if __name__ == '__main__':
    app.run(debug=True)