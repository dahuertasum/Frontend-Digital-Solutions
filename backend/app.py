from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

app = Flask(__name__, static_folder='../public', static_url_path='')
app.config['SECRET_KEY'] = 'mi_clave_super_secreta'
CORS(app)

# 🔗 CONEXIÓN A RAILWAY
db = mysql.connector.connect(
    host="tramway.proxy.rlwy.net",
    user="root",
    password="IQCVOqAecROUXHeVjDIDcNGsfktWFPuR",
    database="railway",
    port=27629
)

# 🌐 HOME
@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

# 📄 RUTAS DE PÁGINAS (HTML)
@app.route('/login', methods=['GET'])
def login_page():
    return send_from_directory(app.static_folder, 'login.html')

@app.route('/registro', methods=['GET'])
def registro_page():
    return send_from_directory(app.static_folder, 'registro.html')

@app.route('/productos', methods=['GET'])
def productos_page():
    return send_from_directory(app.static_folder, 'productos.html')

@app.route('/contacto', methods=['GET'])
def contacto_page():
    return send_from_directory(app.static_folder, 'contacto.html')

@app.route('/dashboard', methods=['GET'])
def dashboard_page():
    return send_from_directory(app.static_folder, 'dashboard.html')


# 🔐 LOGIN (API)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE email=%s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):

        token = jwt.encode({
            "user_id": user["id"],
            "email": user["email"],
            "rol": user["rol"],
            "exp": datetime.now(timezone.utc) + timedelta(hours=2)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({
            "message": "Login exitoso",
            "token": token
        })

    return jsonify({"message": "Credenciales incorrectas"}), 401


# 📝 REGISTRO (API)
@app.route('/registro', methods=['POST'])
def registro():
    data = request.json
    nombre = data['nombre']
    email = data['email']
    password = data['password']

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO usuarios (nombre,email,password) VALUES (%s,%s,%s)",
        (nombre, email, hashed_password)
    )
    db.commit()

    return jsonify({"message": "Usuario registrado"})


# 👥 OBTENER USUARIOS (PROTEGIDO)
@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"message": "Token requerido"}), 403

    try:
        token = token.split(" ")[1]
        jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
    except:
        return jsonify({"message": "Token inválido o expirado"}), 401

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id,nombre,email,rol FROM usuarios")
    usuarios = cursor.fetchall()

    return jsonify(usuarios)


# 🗑 ELIMINAR USUARIO
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id=%s", (id,))
    db.commit()

    return jsonify({"message": "Usuario eliminado"})


# ✏️ ACTUALIZAR USUARIO
@app.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = request.json

    cursor = db.cursor()
    cursor.execute(
        "UPDATE usuarios SET nombre=%s,email=%s WHERE id=%s",
        (data['nombre'], data['email'], id)
    )
    db.commit()

    return jsonify({"message": "Usuario actualizado"})


# 📦 SERVIR ARCHIVOS ESTÁTICOS (CSS, JS, IMG)
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)


# 🚀 RUN
if __name__ == '__main__':
    app.run(debug=True)