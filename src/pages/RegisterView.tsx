import React, { useState } from "react";
import { Shield } from "lucide-react";
import Button from "../components/ui/Button";

interface RegisterViewProps {
  onRegister: (user: any) => boolean;
  onNavigate: (view: string) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onNavigate }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Cajero"); // Rol por defecto al registrarse libremente

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    const success = onRegister({
      username,
      email,
      password,
      role,
      isActive: true
    });

    if (success) {
      alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
      onNavigate("login");
    } else {
      alert("Hubo un error al registrar el usuario.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Shield size={40} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crear una Cuenta</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Regístrate en MarketPro</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="ej. carlos.mendoza"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rol Inicial</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="Cajero">Cajero</option>
                <option value="Bodega">Bodega</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full flex justify-center">Registrar Cuenta</Button>
            </div>
            
            <div className="text-center text-sm mt-2">
              <button type="button" onClick={() => onNavigate("login")} className="text-blue-600 hover:underline">
                ¿Ya tienes una cuenta? Inicia sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;