import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Key, CheckCircle, XCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/Logo';
import { sampleUsers } from '../data/users';

/**
 * PÁGINA DE RECUPERACIÓN DE CONTRASEÑA
 * 
 * Esta página maneja el proceso completo de recuperación de contraseña:
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * 1. Validación de email del usuario
 * 2. Generación de código de seguridad
 * 3. Verificación del código de seguridad
 * 4. Restablecimiento de nueva contraseña
 * 5. Confirmación de cambio exitoso
 * 
 * FLUJO DEL PROCESO:
 * Paso 1: Usuario ingresa su email
 * Paso 2: Sistema genera código de 6 dígitos
 * Paso 3: Usuario ingresa código recibido
 * Paso 4: Usuario establece nueva contraseña
 * Paso 5: Confirmación y redirección al login
 * 
 * SEGURIDAD:
 * - Validación de email existente en el sistema
 * - Código de seguridad temporal (expira en 10 minutos)
 * - Validación de contraseña segura
 * - Confirmación de contraseña
 */

interface ForgotPasswordProps {
  onBackToLogin: () => void; // Función para regresar al login
}

// TIPOS DE PASOS EN EL PROCESO DE RECUPERACIÓN
type Step = 'email' | 'code' | 'password' | 'success';

// INTERFAZ PARA MENSAJES DE ESTADO
interface StatusMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  // ESTADOS DEL COMPONENTE
  const [currentStep, setCurrentStep] = useState<Step>('email'); // Paso actual del proceso
  const [email, setEmail] = useState(''); // Email del usuario
  const [securityCode, setSecurityCode] = useState(''); // Código de seguridad ingresado
  const [generatedCode, setGeneratedCode] = useState(''); // Código generado por el sistema
  const [newPassword, setNewPassword] = useState(''); // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmación de contraseña
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [message, setMessage] = useState<StatusMessage | null>(null); // Mensajes de estado
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Errores de validación

  /**
   * FUNCIÓN PARA LIMPIAR ERRORES
   * 
   * Elimina el error de un campo específico cuando el usuario comienza a escribir
   * 
   * @param field - Campo del cual limpiar el error
   */
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /**
   * FUNCIÓN PARA MOSTRAR MENSAJES TEMPORALES
   * 
   * Muestra un mensaje y lo oculta automáticamente después de un tiempo
   * 
   * @param type - Tipo de mensaje (success, error, info)
   * @param text - Texto del mensaje
   * @param duration - Duración en milisegundos (por defecto 5000)
   */
  const showMessage = (type: StatusMessage['type'], text: string, duration = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  /**
   * FUNCIÓN PARA GENERAR CÓDIGO DE SEGURIDAD
   * 
   * Genera un código aleatorio de 6 dígitos para verificación
   * 
   * @returns Código de 6 dígitos como string
   */
  const generateSecurityCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  /**
   * FUNCIÓN PARA SIMULAR ENVÍO DE EMAIL
   * 
   * Simula el envío de un email con el código de seguridad
   * En una implementación real, aquí se llamaría a un servicio de email
   * 
   * @param email - Email del destinatario
   * @param code - Código de seguridad a enviar
   */
  const simulateEmailSending = async (email: string, code: string): Promise<void> => {
    // SIMULAR DELAY DE ENVÍO DE EMAIL
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // EN PRODUCCIÓN, AQUÍ SE ENVIARÍA EL EMAIL REAL
    console.log(`📧 Email enviado a: ${email}`);
    console.log(`🔐 Código de seguridad: ${code}`);
    console.log(`⏰ El código expira en 10 minutos`);
    
    // MOSTRAR EL CÓDIGO EN CONSOLA PARA TESTING
    // EN PRODUCCIÓN, ESTO NO DEBE MOSTRARSE
    alert(`🔐 Código de seguridad (solo para testing): ${code}`);
  };

  /**
   * PASO 1: VALIDAR EMAIL Y ENVIAR CÓDIGO
   * 
   * Valida que el email exista en el sistema y envía código de seguridad
   */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // LIMPIAR ERRORES PREVIOS
    setErrors({});
    
    // VALIDAR EMAIL
    if (!email.trim()) {
      setErrors({ email: 'El email es requerido' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Ingrese un email válido' });
      return;
    }
    
    // VERIFICAR QUE EL EMAIL EXISTA EN EL SISTEMA
    const userExists = sampleUsers.find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!userExists) {
      setErrors({ email: 'No existe una cuenta asociada a este email' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // GENERAR CÓDIGO DE SEGURIDAD
      const code = generateSecurityCode();
      setGeneratedCode(code);
      
      // SIMULAR ENVÍO DE EMAIL
      await simulateEmailSending(email, code);
      
      // AVANZAR AL SIGUIENTE PASO
      setCurrentStep('code');
      showMessage('success', `Código de seguridad enviado a ${email}`, 7000);
      
    } catch (error) {
      console.error('Error enviando email:', error);
      showMessage('error', 'Error al enviar el código. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * PASO 2: VERIFICAR CÓDIGO DE SEGURIDAD
   * 
   * Valida que el código ingresado coincida con el generado
   */
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // LIMPIAR ERRORES PREVIOS
    setErrors({});
    
    // VALIDAR CÓDIGO
    if (!securityCode.trim()) {
      setErrors({ code: 'El código de seguridad es requerido' });
      return;
    }
    
    if (securityCode.length !== 6) {
      setErrors({ code: 'El código debe tener 6 dígitos' });
      return;
    }
    
    if (!/^\d{6}$/.test(securityCode)) {
      setErrors({ code: 'El código solo debe contener números' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // SIMULAR VERIFICACIÓN DEL CÓDIGO
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // VERIFICAR QUE EL CÓDIGO COINCIDA
      if (securityCode !== generatedCode) {
        setErrors({ code: 'Código de seguridad incorrecto' });
        return;
      }
      
      // AVANZAR AL SIGUIENTE PASO
      setCurrentStep('password');
      showMessage('success', 'Código verificado correctamente');
      
    } catch (error) {
      console.error('Error verificando código:', error);
      showMessage('error', 'Error al verificar el código. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * PASO 3: ESTABLECER NUEVA CONTRASEÑA
   * 
   * Valida y guarda la nueva contraseña del usuario
   */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // LIMPIAR ERRORES PREVIOS
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    
    // VALIDAR NUEVA CONTRASEÑA
    if (!newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }
    
    // VALIDAR CONFIRMACIÓN DE CONTRASEÑA
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme la nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // SIMULAR ACTUALIZACIÓN DE CONTRASEÑA EN BASE DE DATOS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // EN PRODUCCIÓN, AQUÍ SE ACTUALIZARÍA LA CONTRASEÑA EN LA BASE DE DATOS
      console.log(`🔐 Contraseña actualizada para: ${email}`);
      
      // AVANZAR AL PASO FINAL
      setCurrentStep('success');
      
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      showMessage('error', 'Error al actualizar la contraseña. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * FUNCIÓN PARA REENVIAR CÓDIGO
   * 
   * Genera y envía un nuevo código de seguridad
   */
  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      // GENERAR NUEVO CÓDIGO
      const newCode = generateSecurityCode();
      setGeneratedCode(newCode);
      
      // SIMULAR REENVÍO DE EMAIL
      await simulateEmailSending(email, newCode);
      
      showMessage('info', 'Nuevo código enviado a su email');
      
    } catch (error) {
      console.error('Error reenviando código:', error);
      showMessage('error', 'Error al reenviar el código. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * FUNCIÓN PARA RENDERIZAR EL CONTENIDO SEGÚN EL PASO ACTUAL
   * 
   * Muestra el formulario correspondiente al paso actual del proceso
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Recuperar Contraseña
              </h2>
              <p className="text-gray-500 text-sm">
                Ingrese su email para recibir un código de seguridad
              </p>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              error={errors.email}
              placeholder="Ingrese su email"
              icon={<Mail size={18} />}
              required
              autoFocus
            />

            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading}
              className="mt-6"
            >
              Enviar Código de Seguridad
            </Button>
          </form>
        );

      case 'code':
        return (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Verificar Código
              </h2>
              <p className="text-gray-500 text-sm">
                Ingrese el código de 6 dígitos enviado a su email
              </p>
              <p className="text-primary text-sm font-medium mt-1">
                {email}
              </p>
            </div>

            <Input
              label="Código de Seguridad"
              type="text"
              value={securityCode}
              onChange={(e) => {
                // SOLO PERMITIR NÚMEROS Y MÁXIMO 6 DÍGITOS
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setSecurityCode(value);
                clearError('code');
              }}
              error={errors.code}
              placeholder="123456"
              icon={<Key size={18} />}
              maxLength={6}
              required
              autoFocus
            />

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Reenviar código
              </button>
              <span className="text-xs text-gray-500">
                El código expira en 10 minutos
              </span>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading}
              className="mt-6"
            >
              Verificar Código
            </Button>
          </form>
        );

      case 'password':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Nueva Contraseña
              </h2>
              <p className="text-gray-500 text-sm">
                Establezca una nueva contraseña segura para su cuenta
              </p>
            </div>

            <Input
              label="Nueva Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearError('newPassword');
              }}
              error={errors.newPassword}
              placeholder="Ingrese su nueva contraseña"
              icon={<Lock size={18} />}
              required
              autoFocus
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError('confirmPassword');
              }}
              error={errors.confirmPassword}
              placeholder="Confirme su nueva contraseña"
              icon={<Lock size={18} />}
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              <p className="font-medium mb-1">Requisitos de contraseña:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Mínimo 6 caracteres</li>
                <li>Al menos una letra mayúscula</li>
                <li>Al menos una letra minúscula</li>
                <li>Al menos un número</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading}
              className="mt-6"
            >
              Actualizar Contraseña
            </Button>
          </form>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-success-600" />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                ¡Contraseña Actualizada!
              </h2>
              <p className="text-gray-500 text-sm">
                Su contraseña ha sido actualizada exitosamente.
                Ya puede iniciar sesión con su nueva contraseña.
              </p>
            </div>

            <Button 
              onClick={onBackToLogin}
              fullWidth
              className="mt-6"
            >
              Ir al Inicio de Sesión
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ 
          boxShadow: '0 10px 25px -5px rgba(0, 51, 102, 0.1), 0 8px 10px -6px rgba(0, 51, 102, 0.05)'
        }}
      >
        {/* HEADER CON LOGO */}
        <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b border-gray-200">
          <Logo className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">MarketPro</h1>
          <p className="text-gray-500 text-center mt-1">
            Sistema de Gestión de Inventarios
          </p>
        </div>
        
        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6">
          {/* MENSAJES DE ESTADO */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-success-50 border border-success-200 text-success-700' 
                : message.type === 'error'
                ? 'bg-error-50 border border-error-200 text-error-700'
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : message.type === 'error' ? (
                <XCircle size={20} />
              ) : (
                <Mail size={20} />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* CONTENIDO DEL PASO ACTUAL */}
          {renderStepContent()}

          {/* BOTÓN PARA REGRESAR AL LOGIN */}
          {currentStep !== 'success' && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onBackToLogin}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Regresar al inicio de sesión
              </button>
            </div>
          )}
        </div>
        
        {/* FOOTER */}
        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} MarketPro • Todos los derechos reservados
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;