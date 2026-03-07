# Digital Solutions

Sistema web para la gestión y venta de equipos tecnológicos reacondicionados.
El proyecto incluye autenticación de usuarios, panel de administración y gestión de usuarios mediante una API desarrollada en Python Flask.

🚀 Funcionalidades

- Registro de usuarios

- Inicio de sesión con autenticación

- Contraseñas encriptadas

- Autenticación con JWT

- Panel de administración

- Gestión de usuarios

    - Crear usuarios

    - Editar usuarios

    - Eliminar usuarios

Dashboard con estadísticas

Sistema de roles

  - Administrador

  - Cliente

🧑‍💻 Tecnologías utilizadas
Frontend

HTML

CSS

JavaScript

Backend

Python

Flask

JWT Authentication

Base de datos

MySQL

📂 Estructura del proyecto
Frontend-Digital-Solutions
│
├── backend
│   ├── app.py
│
├── database
│   └── digital_solutions.sql
│
├── public
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── productos.html
│   └── dashboard.html
│
├── src
│   ├── css
│   ├── js
│   └── assets
│
└── README.md

🗄 Base de datos

Para crear la base de datos ejecuta el archivo:
database/digital_solutions.sql
Ejemplo:
CREATE DATABASE digital_solutions;
USE digital_solutions;

⚙️ Instalación del proyecto
1️⃣ Clonar el repositorio
git clone https://github.com/dahuertasum/Frontend-Digital-Solutions.git
2️⃣ Instalar dependencias
pip install flask flask-cors pyjwt mysql-connector-python bcrypt
3️⃣ Configurar la base de datos

Editar en app.py:

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="TU_PASSWORD",
    database="digital_solutions"
)
4️⃣ Ejecutar el servidor
python app.py

El backend se ejecutará en:

http://127.0.0.1:5000

🔐 Autenticación

El sistema utiliza JSON Web Tokens (JWT) para proteger las rutas del panel de administración.

Cuando un usuario inicia sesión se genera un token que se almacena en el navegador.

📊 Panel de administración

El panel permite:

Visualizar usuarios registrados

Editar usuarios

Eliminar usuarios

Ver estadísticas de usuarios

👨‍💻 Autor

Daniel Huertas
Proyecto académico - Ingeniería de Sistemas

