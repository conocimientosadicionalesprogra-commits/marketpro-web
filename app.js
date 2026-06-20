const express = require('express');
const cors = require('cors'); // 1. Importa CORS
const conectarDB = require('./db');
const Usuario = require('./models/Usuario');

const app = express();

// Middleware para que Express entienda los datos en formato JSON
app.use(express.static('public'));
app.use(express.json());

// 1. Conectar a la base de datos
conectarDB();

// 2. Definir una Ruta para agregar usuarios (POST)
app.post('/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body); // Toma los datos que envíes
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario creado!", usuario: nuevoUsuario });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 3. Definir una Ruta para ver todos los usuarios (GET)
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Iniciar el servidor
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});