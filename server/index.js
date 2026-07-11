import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// 1. Configuración Inicial de variables de entorno
dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 5000;

// 2. Middlewares de Seguridad y Datos (CORS Arreglado)
app.use(express.json());
app.use(cors({
  origin: true, // 💡 Permite conectar cualquier entorno de desarrollo local sin bloqueos
  credentials: true
}));

// 3. Conexión Establecida a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 ¡Conectado exitosamente a MongoDB Atlas!"))
  .catch((err) => console.error("❌ Error crítico de conexión a MongoDB:", err));

// --- 4. MODELO DE USUARIO ---
const Usuario = mongoose.model("Usuario", new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}));

// --- 5. RUTAS DE AUTENTICACIÓN ---

// 🔓 RUTA: INICIAR SESIÓN (LOGIN)
app.post("/api/usuarios/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar si el usuario existe por correo o por nombre de usuario
    const usuario = await Usuario.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: email.trim() }
      ]
    });

    if (!usuario) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Comparar la contraseña escrita con el hash seguro encriptado
    const contraseñaValida = await bcrypt.compare(password, usuario.password);
if (!contraseñaValida) {
  return res.status(400).json({ error: "Usuario o contraseña incorrectos" });

    // Convertir a objeto plano para limpiar la clave antes de responder
    const usuarioLogueado = usuario.toObject();
    delete usuarioLogueado.password;

    res.json({
      mensaje: "¡Ingreso exitoso!",
      usuario: usuarioLogueado
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📝 RUTA: REGISTRAR NUEVO USUARIO
app.post("/api/usuarios", async (req, res) => {
  try {
    const { username, email, password, role, isActive } = req.body;

    // Generar semilla y encriptar contraseña de forma segura
    const salt = await bcrypt.genSalt(10);
const passwordEncriptada = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: passwordEncriptada,
      role: role || "admin",
      isActive: isActive !== undefined ? isActive : true
    });

    await nuevoUsuario.save();

    const usuarioCreado = nuevoUsuario.toObject();
    delete usuarioCreado.password;

    res.status(201).json(usuarioCreado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 6. ENCENDER EL SERVIDOR ---
app.listen(PORT, () => {
  console.log((`💻 Servidor de MarketPro corriendo en el puerto ${PORT}`));
});
