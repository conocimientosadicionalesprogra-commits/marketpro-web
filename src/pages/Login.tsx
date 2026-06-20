import React from 'react';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  onNavigate: (view: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  /**
   * FUNCIÓN PARA MANEJAR "OLVIDÉ MI CONTRASEÑA"
   * 
   * Esta función se ejecuta cuando el usuario hace clic en "Olvidé mi contraseña"
   * Navega a la vista de recuperación de contraseña
   */
  const handleForgotPassword = () => {
    onNavigate('forgot-password');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ 
          boxShadow: '0 10px 25px -5px rgba(0, 51, 102, 0.1), 0 8px 10px -6px rgba(0, 51, 102, 0.05)'
        }}
      >
        <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b border-gray-200">
          <Logo className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido a MarketPro</h1>
          <p className="text-gray-500 text-center mt-1">
            Sistema de Gestión de Inventarios
          </p>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Iniciar Sesión</h2>
          <LoginForm onSubmit={onLogin} onForgotPassword={handleForgotPassword} />
        </div>
        
        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} MarketPro • Todos los derechos reservados
        </div>
      </div>
    </div>
  );
};

export default Login;