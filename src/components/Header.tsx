import React, { useState } from "react";
import { LogIn, User, Settings, LogOut, ChevronDown } from "lucide-react";

/**
 * COMPONENTE HEADER (ENCABEZADO)
 * 
 * Este componente renderiza la barra superior de la aplicación con las siguientes funcionalidades:
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * 1. Muestra el título de la aplicación
 * 2. Maneja el estado de autenticación del usuario
 * 3. Muestra información del usuario logueado (avatar, nombre, rol)
 * 4. Proporciona menú desplegable con opciones de perfil
 * 5. Permite cerrar sesión
 * 
 * ESTADOS DE LA INTERFAZ:
 * - No autenticado: Muestra botón de "Iniciar Sesión"
 * - Autenticado: Muestra avatar del usuario y menú desplegable
 * 
 * MENÚ DESPLEGABLE (cuando está autenticado):
 * - Editar Perfil: Navega a la página de edición de perfil
 * - Cerrar Sesión: Cierra la sesión del usuario
 */

interface HeaderProps {
  onNavigate: (view: string) => void; // Función para navegar entre vistas
  isAuthenticated?: boolean; // Estado de autenticación del usuario
  currentUser?: { // Información del usuario actual
    username: string;
    email: string;
    role: string;
  };
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isAuthenticated = false, currentUser }) => {
  // ESTADO LOCAL PARA CONTROLAR LA VISIBILIDAD DEL MENÚ DESPLEGABLE
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /**
   * FUNCIÓN PARA MANEJAR EL CLIC EN "INICIAR SESIÓN"
   * Navega a la página de login cuando el usuario no está autenticado
   */
  const handleLoginClick = () => {
    onNavigate("login");
  };

  /**
   * FUNCIÓN PARA ALTERNAR LA VISIBILIDAD DEL MENÚ DE PERFIL
   * Abre o cierra el menú desplegable del usuario
   */
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  /**
   * FUNCIÓN PARA NAVEGAR A LA PÁGINA DE EDICIÓN DE PERFIL
   * Cierra el menú y navega a la vista de perfil
   */
  const handleEditProfile = () => {
    setShowProfileMenu(false);
    onNavigate("profile");
  };

  /**
   * FUNCIÓN PARA CERRAR SESIÓN
   * Cierra el menú y ejecuta el proceso de logout
   */
  const handleLogout = () => {
    setShowProfileMenu(false);
    onNavigate("logout");
  };

  // RENDERIZADO PARA USUARIO NO AUTENTICADO
  if (!isAuthenticated) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 h-16">
          <div className="flex items-center justify-between h-full">
            {/* TÍTULO DE LA APLICACIÓN */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">
                Sistema de Gestión de Inventarios
              </h1>
            </div>
            
            {/* BOTÓN DE INICIAR SESIÓN */}
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <LogIn size={20} />
              <span className="text-sm font-medium">Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // RENDERIZADO PARA USUARIO AUTENTICADO
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 h-16"> {/* ALTURA FIJA DE 64px (h-16) PARA COINCIDIR CON SIDEBAR */}
        <div className="flex items-center justify-between h-full">
          {/* TÍTULO DE LA APLICACIÓN */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">
              Sistema de Gestión de Inventarios
            </h1>
          </div>
          
          {/* SECCIÓN DE PERFIL DE USUARIO */}
          <div className="relative">
            {/* BOTÓN DE PERFIL CON INFORMACIÓN DEL USUARIO */}
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors h-12" // ALTURA FIJA h-12 (48px)
            >
              {/* AVATAR DEL USUARIO */}
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              
              {/* INFORMACIÓN DEL USUARIO */}
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {currentUser?.username || "Usuario"}
                </div>
                <div className="text-xs text-gray-500">
                  {currentUser?.role || "Rol"}
                </div>
              </div>
              
              {/* ICONO DE FLECHA PARA INDICAR MENÚ DESPLEGABLE */}
              <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
            </button>

            {/* MENÚ DESPLEGABLE DEL PERFIL */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {/* OPCIÓN PARA EDITAR PERFIL */}
                <button
                  onClick={handleEditProfile}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} />
                  Editar Perfil
                </button>
                
                {/* SEPARADOR */}
                <hr className="my-1" />
                
                {/* OPCIÓN PARA CERRAR SESIÓN */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;