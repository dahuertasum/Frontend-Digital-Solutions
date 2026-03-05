from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
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

    cursor = db.cursor()

    query = "SELECT * FROM usuarios WHERE email=%s AND password=%s"
    cursor.execute(query, (email, password))

    user = cursor.fetchone()

    if user:
        return jsonify({"message":"Login exitoso"})
    else:
        return jsonify({"message":"Credenciales incorrectas"}),401


# REGISTRO
@app.route('/registro', methods=['POST'])
def registro():

    data = request.json
    nombre = data['nombre']
    email = data['email']
    password = data['password']

    cursor = db.cursor()

    query = "INSERT INTO usuarios (nombre,email,password) VALUES (%s,%s,%s)"
    cursor.execute(query,(nombre,email,password))

    db.commit()

    return jsonify({"message":"Usuario registrado"})


if __name__ == '__main__':
    app.run(debug=True)