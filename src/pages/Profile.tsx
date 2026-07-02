import React, { useState } from "react";
import { ArrowLeft, Save, User, Mail, Shield, Calendar } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { USER_ROLES } from "../types/user";

interface ProfileProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: Date;
  };
  onUpdateProfile: (userData: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  currentView, 
  onNavigate, 
  currentUser,
  onUpdateProfile 
}) => {
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    role: currentUser.role,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Ingrese su contraseña actual para cambiarla";
      }
      
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "La nueva contraseña debe tener al menos 6 caracteres";
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...currentUser,
        username: formData.username,
        email: formData.email,
        role: formData.role
      };
      
      onUpdateProfile(updatedUser);
      setIsLoading(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      alert("Perfil actualizado exitosamente");
    }, 1000);
  };

  const handleBack = () => {
    onNavigate("dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Volver al Panel de Control
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User size={20} />
              Información Personal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre de Usuario"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                error={errors.username}
                placeholder="Ingrese su nombre de usuario"
                icon={<User size={18} />}
                required
              />

              <Input
                label="Correo Electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                placeholder="Ingrese su email"
                icon={<Mail size={18} />}
                required
              />
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield size={20} />
              Información del Sistema
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de Usuario
                </label>
                <input
                  type="text"
                  value={currentUser.id}
                  disabled
                  className="w-full py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Este campo no se puede modificar</p>
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol del Usuario
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Creación
                </label>
                <div className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-gray-100">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-gray-500">
                    {currentUser.createdAt.toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Este campo no se puede modificar</p>
              </div>
            </div>
          </div>

          {/* Cambio de Contraseña */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield size={20} />
              Cambiar Contraseña
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Contraseña Actual"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                error={errors.currentPassword}
                placeholder="Ingrese su contraseña actual"
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                error={errors.newPassword}
                placeholder="Ingrese la nueva contraseña"
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                placeholder="Confirme la nueva contraseña"
              />
            </div>
            
            <p className="text-sm text-gray-500">
              Deje estos campos vacíos si no desea cambiar su contraseña
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              isLoading={isLoading}
              className="flex items-center gap-2"
            >
              <Save size={18} />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;