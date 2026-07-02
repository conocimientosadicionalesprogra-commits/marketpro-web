
import React, { useState } from "react";
// Quitamos Shield de los imports ya que no lo usaremos aquí
import Button from "../components/ui/Button";

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  onNavigate: (view: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    // Eliminamos espacios accidentales al inicio o final con .trim()
    onLogin({ 
      username: username.trim(), 
      password: password.trim() 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* === SECCIÓN MODIFICADA: REEMPLAZO DEL ESCUDO POR TU LOGO === */}
        <div className="flex justify-center mb-4">
          <img
  src={`${import.meta.env.BASE_URL}MarketPro.png`}
  alt="Logo MarketPro"
  className="h-16 w-auto object-contain"
/>
        </div>
        {/* ========================================================== */}

        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">MarketPro</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Sistema de Gestión de Inventarios</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuario o Correo Electrónico</label>
              <div className="mt-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="ej. admin"
                  autoCapitalize="none"   // 👈 Evita mayúsculas automáticas en celulares
                  autoCorrect="off"       // 👈 Apaga el autocorrector molesto
                  spellCheck="false"      // 👈 Quita las líneas rojas de ortografía
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="••••••••"
                  autoCapitalize="none"   // 👈 Protege también la clave de las mayúsculas iniciales
                  autoCorrect="off"
                  required
                />
              </div>
            </div>

            <div className="text-sm text-right">
              <button
                type="button"
                onClick={() => onNavigate("forgot-password")}
                className="font-medium text-primary hover:text-primary/80"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center">
                Iniciar Sesión
              </Button>
            </div>

            {/* --- SECCIÓN REESTRUCTURADA PARA REGISTRO --- */}
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Eres nuevo en el sistema?</span>
              </div>
            </div>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Crear una cuenta nueva
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;