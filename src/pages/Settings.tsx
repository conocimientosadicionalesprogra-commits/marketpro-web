import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Tags,
  Percent,
  Bell,
  Users,
  Globe,
  Shield,
  Database,
  Palette,
  ChevronRight,
  Save,
  Check,
  Plus,
  Edit3,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { PRODUCT_CATEGORIES } from '../types/product';
import { USER_ROLES } from '../types/user';

interface SettingsProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  preview: {
    primary: string;
    accent: string;
    background: string;
  };
  isCustom?: boolean;
}

const DEFAULT_THEMES: ColorTheme[] = [
  {
    id: 'default',
    name: 'Azul Corporativo (Por defecto)',
    primary: '#003366',
    accent: '#0E8B83',
    background: '#F5F5F5',
    preview: { primary: '#003366', accent: '#0E8B83', background: '#F5F5F5' }
  },
  {
    id: 'forest',
    name: 'Verde Bosque',
    primary: '#1B4332',
    accent: '#52B788',
    background: '#F8F9FA',
    preview: { primary: '#1B4332', accent: '#52B788', background: '#F8F9FA' }
  },
  {
    id: 'ocean',
    name: 'Azul Océano',
    primary: '#1E3A8A',
    accent: '#3B82F6',
    background: '#F1F5F9',
    preview: { primary: '#1E3A8A', accent: '#3B82F6', background: '#F1F5F9' }
  },
  {
    id: 'sunset',
    name: 'Naranja Atardecer',
    primary: '#9A3412',
    accent: '#F97316',
    background: '#FEF7ED',
    preview: { primary: '#9A3412', accent: '#F97316', background: '#FEF7ED' }
  },
  {
    id: 'purple',
    name: 'Púrpura Elegante',
    primary: '#581C87',
    accent: '#A855F7',
    background: '#FAF5FF',
    preview: { primary: '#581C87', accent: '#A855F7', background: '#FAF5FF' }
  },
  {
    id: 'emerald',
    name: 'Esmeralda Moderno',
    primary: '#064E3B',
    accent: '#10B981',
    background: '#ECFDF5',
    preview: { primary: '#064E3B', accent: '#10B981', background: '#ECFDF5' }
  },
  {
    id: 'slate',
    name: 'Gris Profesional',
    primary: '#1E293B',
    accent: '#64748B',
    background: '#F8FAFC',
    preview: { primary: '#1E293B', accent: '#64748B', background: '#F8FAFC' }
  },
  {
    id: 'rose',
    name: 'Rosa Ejecutivo',
    primary: '#881337',
    accent: '#F43F5E',
    background: '#FFF1F2',
    preview: { primary: '#881337', accent: '#F43F5E', background: '#FFF1F2' }
  }
];

const Settings: React.FC<SettingsProps> = ({ currentView, onNavigate }) => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>(DEFAULT_THEMES);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customTheme, setCustomTheme] = useState({
    name: '',
    primary: '#003366',
    accent: '#0E8B83',
    background: '#F5F5F5'
  });
  const [editingTheme, setEditingTheme] = useState<string | null>(null);

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedCustomThemes = localStorage.getItem('customThemes');
    
    if (savedCustomThemes) {
      try {
        const customThemes = JSON.parse(savedCustomThemes);
        setColorThemes([...DEFAULT_THEMES, ...customThemes]);
      } catch (error) {
        console.error('Error loading custom themes:', error);
      }
    }
    
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = colorThemes.find(t => t.id === themeId);
    if (theme) {
      // Apply CSS custom properties to root element
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-accent', theme.accent);
      root.style.setProperty('--color-background', theme.background);
      
      // Update Tailwind classes dynamically
      const style = document.createElement('style');
      style.innerHTML = `
        :root {
          --tw-color-primary: ${theme.primary};
          --tw-color-accent: ${theme.accent};
          --tw-color-background: ${theme.background};
        }
        .bg-primary { background-color: ${theme.primary} !important; }
        .text-primary { color: ${theme.primary} !important; }
        .border-primary { border-color: ${theme.primary} !important; }
        .bg-accent { background-color: ${theme.accent} !important; }
        .text-accent { color: ${theme.accent} !important; }
        .bg-background { background-color: ${theme.background} !important; }
        .bg-primary\\/10 { background-color: ${theme.primary}1A !important; }
        .bg-accent\\/10 { background-color: ${theme.accent}1A !important; }
        .hover\\:bg-primary\\/10:hover { background-color: ${theme.primary}1A !important; }
        .focus\\:ring-primary\\/50:focus { --tw-ring-color: ${theme.primary}80 !important; }
        .focus\\:border-primary:focus { border-color: ${theme.primary} !important; }
      `;
      
      // Remove previous dynamic styles
      const existingStyle = document.getElementById('dynamic-theme');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      style.id = 'dynamic-theme';
      document.head.appendChild(style);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('selectedTheme', themeId);
  };

  const handleSaveTheme = () => {
    // Save current theme selection
    localStorage.setItem('selectedTheme', selectedTheme);
    
    // Save custom themes
    const customThemes = colorThemes.filter(theme => theme.isCustom);
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
    
    alert('Configuración de tema guardada exitosamente');
  };

  const handleCreateCustomTheme = () => {
    if (!customTheme.name.trim()) {
      alert('Por favor ingrese un nombre para el tema personalizado');
      return;
    }

    const newTheme: ColorTheme = {
      id: `custom-${Date.now()}`,
      name: customTheme.name,
      primary: customTheme.primary,
      accent: customTheme.accent,
      background: customTheme.background,
      preview: {
        primary: customTheme.primary,
        accent: customTheme.accent,
        background: customTheme.background
      },
      isCustom: true
    };

    const updatedThemes = [...colorThemes, newTheme];
    setColorThemes(updatedThemes);
    
    // Save custom themes to localStorage
    const customThemes = updatedThemes.filter(theme => theme.isCustom);
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
    
    // Reset form
    setCustomTheme({
      name: '',
      primary: '#003366',
      accent: '#0E8B83',
      background: '#F5F5F5'
    });
    setIsCreatingCustom(false);
    
    // Auto-select the new theme
    handleThemeChange(newTheme.id);
  };

  const handleDeleteCustomTheme = (themeId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este tema personalizado?')) {
      const updatedThemes = colorThemes.filter(theme => theme.id !== themeId);
      setColorThemes(updatedThemes);
      
      // Update localStorage
      const customThemes = updatedThemes.filter(theme => theme.isCustom);
      localStorage.setItem('customThemes', JSON.stringify(customThemes));
      
      // If deleted theme was selected, switch to default
      if (selectedTheme === themeId) {
        handleThemeChange('default');
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Personalización de Apariencia</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Temas Predefinidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colorThemes.filter(theme => !theme.isCustom).map((theme) => (
                    <div
                      key={theme.id}
                      className={`
                        relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                        ${selectedTheme === theme.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2">
                          <Check size={20} className="text-primary" />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: theme.preview.primary }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: theme.preview.accent }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: theme.preview.background }}
                          ></div>
                        </div>
                        <span className="font-medium text-gray-900">{theme.name}</span>
                      </div>
                      
                      <div 
                        className="h-16 rounded border border-gray-200 p-2 flex items-center justify-between"
                        style={{ backgroundColor: theme.preview.background }}
                      >
                        <div 
                          className="px-3 py-1 rounded text-white text-xs font-medium"
                          style={{ backgroundColor: theme.preview.primary }}
                        >
                          Primario
                        </div>
                        <div 
                          className="px-3 py-1 rounded text-white text-xs font-medium"
                          style={{ backgroundColor: theme.preview.accent }}
                        >
                          Acento
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        <div>Primario: {theme.primary}</div>
                        <div>Acento: {theme.accent}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Themes Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Temas Personalizados</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatingCustom(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Crear Tema
                  </Button>
                </div>

                {/* Create Custom Theme Form */}
                {isCreatingCustom && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">Crear Tema Personalizado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nombre del Tema"
                        value={customTheme.name}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Mi Tema Personalizado"
                        className="!mb-0"
                      />
                      <div></div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color Primario
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customTheme.primary}
                            onChange={(e) => setCustomTheme(prev => ({ ...prev, primary: e.target.value }))}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customTheme.primary}
                            onChange={(e) => setCustomTheme(prev => ({ ...prev, primary: e.target.value }))}
                            className="flex-1 py-2 px-3 border border-gray-300 rounded-md text-sm"
                            placeholder="#003366"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color de Acento
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customTheme.accent}
                            onChange={(e) => setCustomTheme(prev => ({ ...prev, accent: e.target.value }))}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customTheme.accent}
                            onChange={(e) => setCustomTheme(prev => ({ ...prev, accent: e.target.value }))}
                            className="flex-1 py-2 px-3 border border-gray-300 rounded-md text-sm"
                            placeholder="#0E8B83"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color de Fondo
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customTheme.background}
                            onChange={(e) => setCustomTheme(prev => ({ ...prev, background: e.target.value }))}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customTheme.background}
                            onChange={(e) => setCustomTheme(prev => ({ ...prev, background: e.target.value }))}
                            className="flex-1 py-2 px-3 border border-gray-300 rounded-md text-sm"
                            placeholder="#F5F5F5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vista Previa
                        </label>
                        <div 
                          className="h-16 rounded border border-gray-200 p-2 flex items-center justify-between"
                          style={{ backgroundColor: customTheme.background }}
                        >
                          <div 
                            className="px-3 py-1 rounded text-white text-xs font-medium"
                            style={{ backgroundColor: customTheme.primary }}
                          >
                            Primario
                          </div>
                          <div 
                            className="px-3 py-1 rounded text-white text-xs font-medium"
                            style={{ backgroundColor: customTheme.accent }}
                          >
                            Acento
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setIsCreatingCustom(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateCustomTheme}>
                        Crear Tema
                      </Button>
                    </div>
                  </div>
                )}

                {/* Custom Themes Grid */}
                {colorThemes.filter(theme => theme.isCustom).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colorThemes.filter(theme => theme.isCustom).map((theme) => (
                      <div
                        key={theme.id}
                        className={`
                          relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                          ${selectedTheme === theme.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        onClick={() => handleThemeChange(theme.id)}
                      >
                        {selectedTheme === theme.id && (
                          <div className="absolute top-2 right-2">
                            <Check size={20} className="text-primary" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomTheme(theme.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3 mt-4">
                          <div className="flex gap-1">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.preview.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.preview.accent }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.preview.background }}
                            ></div>
                          </div>
                          <span className="font-medium text-gray-900">{theme.name}</span>
                        </div>
                        
                        <div 
                          className="h-16 rounded border border-gray-200 p-2 flex items-center justify-between"
                          style={{ backgroundColor: theme.preview.background }}
                        >
                          <div 
                            className="px-3 py-1 rounded text-white text-xs font-medium"
                            style={{ backgroundColor: theme.preview.primary }}
                          >
                            Primario
                          </div>
                          <div 
                            className="px-3 py-1 rounded text-white text-xs font-medium"
                            style={{ backgroundColor: theme.preview.accent }}
                          >
                            Acento
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          <div>Primario: {theme.primary}</div>
                          <div>Acento: {theme.accent}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Palette size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No hay temas personalizados creados</p>
                    <p className="text-sm">Haz clic en "Crear Tema" para comenzar</p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Palette className="text-blue-600 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-medium text-blue-900">Personalización Avanzada</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Los cambios de tema se aplicarán inmediatamente y se guardarán para futuras sesiones. 
                      Cada cliente puede tener su propio tema personalizado que refleje su identidad corporativa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={handleSaveTheme} className="mt-6">
              <Save size={18} className="mr-2" />
              Guardar Configuración de Tema
            </Button>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Categorías de Productos</h2>
            <div className="grid gap-3">
              {PRODUCT_CATEGORIES.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{category}</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight size={18} />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar Cambios
            </Button>
          </div>
        );

      case 'taxes':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Configuración de Impuestos</h2>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">IVA General (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  defaultValue="19"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">IVA Reducido (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  defaultValue="5"
                />
              </div>
            </div>
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar Cambios
            </Button>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Configuración de Alertas</h2>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Nivel de Stock Mínimo (unidades)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  defaultValue="50"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Nivel de Stock Crítico (unidades)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  defaultValue="20"
                />
              </div>
            </div>
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar Cambios
            </Button>
          </div>
        );

      case 'roles':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Gestión de Roles</h2>
            <div className="grid gap-3">
              {USER_ROLES.map((role) => (
                <div
                  key={role}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{role}</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight size={18} />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar Cambios
            </Button>
          </div>
        );

      case 'global':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Parámetros Globales</h2>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  defaultValue="MarketPro"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Moneda Principal
                </label>
                <select className="w-full p-2 border rounded">
                  <option value="COP">Peso Colombiano (COP)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar Cambios
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Seguridad</h2>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Política de Contraseñas
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Requerir mayúsculas
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Requerir números
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Requerir caracteres especiales
                  </label>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Tiempo de Sesión (minutos)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  defaultValue="30"
                />
              </div>
            </div>
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar Cambios
            </Button>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Backup de Datos</h2>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Backup Automático</h3>
                <label className="flex items-center mb-4">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Activar backup automático
                </label>
                <select className="w-full p-2 border rounded mb-4">
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
                <Button variant="outline" className="w-full">
                  Crear Backup Manual
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Últimos Backups</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>backup_20240315.zip</span>
                    <Button variant="ghost" size="sm">
                      Descargar
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>backup_20240314.zip</span>
                    <Button variant="ghost" size="sm">
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-900">
          <SettingsIcon size={24} />
          <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        <div className="space-y-2">
          <button
            onClick={() => setActiveSection('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'appearance'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Palette size={20} />
            <span>Apariencia</span>
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'categories'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Tags size={20} />
            <span>Categorías</span>
          </button>
          <button
            onClick={() => setActiveSection('taxes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'taxes'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Percent size={20} />
            <span>Impuestos</span>
          </button>
          <button
            onClick={() => setActiveSection('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'alerts'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Bell size={20} />
            <span>Alertas</span>
          </button>
          <button
            onClick={() => setActiveSection('roles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'roles'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Users size={20} />
            <span>Roles</span>
          </button>
          <button
            onClick={() => setActiveSection('global')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'global'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Globe size={20} />
            <span>Parámetros Globales</span>
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'security'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Shield size={20} />
            <span>Seguridad</span>
          </button>
          <button
            onClick={() => setActiveSection('backup')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === 'backup'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <Database size={20} />
            <span>Backup</span>
          </button>
        </div>

        <div className="md:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Settings;