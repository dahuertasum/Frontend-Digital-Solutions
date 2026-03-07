from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

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
            "rol": user["rol"],
            "exp": datetime.now(timezone.utc) + timedelta(hours=2)
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

#Usuarios
@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():

    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"message":"Token requerido"}),403

    try:

        token = token.split(" ")[1]

        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

    except jwt.ExpiredSignatureError:
        return jsonify({"message":"Token expirado, vuelve a iniciar sesión"}),401

    except jwt.InvalidTokenError:
        return jsonify({"message":"Token inválido"}),401


    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id,nombre,email,rol FROM usuarios")
    usuarios = cursor.fetchall()

    return jsonify(usuarios)

@app.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):

    cursor = db.cursor()

    cursor.execute("DELETE FROM usuarios WHERE id=%s",(id,))

    db.commit()

    return jsonify({"message":"Usuario eliminado"})

@app.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):

    data = request.json
    nombre = data['nombre']
    email = data['email']

    cursor = db.cursor()

    query = "UPDATE usuarios SET nombre=%s,email=%s WHERE id=%s"
    cursor.execute(query,(nombre,email,id))

    db.commit()

    return jsonify({"message":"Usuario actualizado"})




if __name__ == '__main__':
    app.run(debug=True)