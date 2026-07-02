import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Logo from "./Logo";
interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onForgotPassword }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors: { username?: string; password?: string } = {};
    
    // Simple validation
    if (!username.trim()) {
      newErrors.username = "El usuario es requerido";
    }
    
    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setErrors(newErrors);
    
    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        onSubmit({ username, password });
        setIsLoading(false);
      }, 1000);
    }
  };

  return (

    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <Logo className="h-16 w-auto" />
      </div>
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <Input
        label="Usuario / Email"
        type="text"
        placeholder="Ingrese su usuario o email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        icon={<User size={18} />}
        required
        autoFocus
      />
      
      <Input
        label="Contraseña"
        type="password"
        placeholder="Ingrese su contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        icon={<Lock size={18} />}
        required
      />
      
      <div className="flex items-center justify-between pt-2">
        <div>
          <a 
            onClick={(e) => {
              e.preventDefault();
              onForgotPassword();
            }}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
      
      <Button 
        type="submit" 
        fullWidth 
        isLoading={isLoading}
        className="mt-4"
      >
        Iniciar Sesión
      </Button>
    </form>
    </div>
  );
};

export default LoginForm;