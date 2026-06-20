const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
    try {
        // Usamos una variable de entorno para la URL
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ ¡Conexión exitosa a MongoDB!');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1); // Detener la app si falla la conexión
    }
};

module.exports = conectarDB;