import React, { useState } from 'react';
import {
  Home,
  Package,
  PlusCircle,
  BarChart3,
  Users,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Tags,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  List,
  FileText,
} from 'lucide-react';
import Logo from './Logo';

/**
 * COMPONENTE SIDEBAR (BARRA LATERAL DE NAVEGACIÓN)
 * 
 * Este componente renderiza la barra lateral de navegación con las siguientes funcionalidades:
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * 1. Navegación principal del sistema
 * 2. Menús desplegables organizados jerárquicamente
 * 3. Control de estado para mostrar/ocultar submenús
 * 4. Indicadores visuales del elemento activo
 * 5. Lógica para mantener solo un menú principal abierto a la vez
 * 
 * ESTRUCTURA DE NAVEGACIÓN:
 * - Panel de Control (página principal)
 * - Productos (menú desplegable)
 *   ├── Lista de Productos
 *   ├── Registrar Producto
 *   └── Categorías
 * - Movimientos de Inventario (menú desplegable)
 *   ├── Entradas (submenú)
 *   │   ├── Registrar Entrada
 *   │   └── Listado de Entradas
 *   ├── Salidas (submenú)
 *   │   ├── Registrar Salida
 *   │   └── Listado de Salidas
 *   └── Devoluciones (submenú)
 *       ├── Registrar Devolución
 *       └── Listado de Devoluciones
 * - Reportes
 * - Usuarios
 * - Alertas de Stock Bajo
 * - Configuración
 * - Cerrar Sesión
 */

/**
 * COMPONENTE PARA ELEMENTOS INDIVIDUALES DEL SIDEBAR
 * 
 * Renderiza un elemento de navegación individual con icono y texto
 */
interface SidebarItemProps {
  icon: React.ReactNode; // Icono del elemento
  label: string; // Texto del elemento
  onClick: () => void; // Función a ejecutar al hacer clic
  active?: boolean; // Si el elemento está activo/seleccionado
  isSubmenu?: boolean; // Si es un submenú (para indentación)
  isSubSubmenu?: boolean; // Si es un sub-submenú (para mayor indentación)
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  onClick, 
  active, 
  isSubmenu = false,
  isSubSubmenu = false 
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
      transition-colors duration-200
      ${isSubSubmenu ? 'pl-16' : isSubmenu ? 'pl-12' : ''} 
      ${active 
        ? 'bg-primary/10 text-primary' 
        : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
      }
    `}
  >
    {icon}
    {label}
  </button>
);

/**
 * COMPONENTE PARA MENÚS DESPLEGABLES
 * 
 * Renderiza un menú que puede expandirse/contraerse con elementos hijos
 */
interface SidebarMenuProps {
  icon: React.ReactNode; // Icono del menú
  label: string; // Texto del menú
  isOpen: boolean; // Si el menú está abierto
  onToggle: () => void; // Función para abrir/cerrar el menú
  children: React.ReactNode; // Elementos hijos del menú
  isSubmenu?: boolean; // Si es un submenú (para indentación)
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ 
  icon, 
  label, 
  isOpen, 
  onToggle, 
  children,
  isSubmenu = false 
}) => (
  <div>
    {/* BOTÓN PARA ABRIR/CERRAR EL MENÚ */}
    <button
      onClick={onToggle}
      className={`
        w-full flex items-center justify-between px-4 py-3 text-sm font-medium 
        text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors duration-200
        ${isSubmenu ? 'pl-12' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {/* ICONO DE FLECHA QUE CAMBIA SEGÚN EL ESTADO */}
      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
    
    {/* CONTENIDO DEL MENÚ (SOLO VISIBLE CUANDO ESTÁ ABIERTO) */}
    {isOpen && (
      <div className="bg-gray-50/50">
        {children}
      </div>
    )}
  </div>
);

/**
 * PROPS DEL COMPONENTE SIDEBAR PRINCIPAL
 */
interface SidebarProps {
  onNavigate: (view: string) => void; // Función para navegar entre vistas
  currentView: string; // Vista actual activa
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView }) => {
  // ESTADOS PARA CONTROLAR QUÉ MENÚS ESTÁN ABIERTOS
  const [isProductsOpen, setIsProductsOpen] = useState(true); // Menú de Productos
  const [isMovementsOpen, setIsMovementsOpen] = useState(false); // Menú de Movimientos
  const [isEntriesOpen, setIsEntriesOpen] = useState(false); // Submenú de Entradas
  const [isExitsOpen, setIsExitsOpen] = useState(false); // Submenú de Salidas
  const [isReturnsOpen, setIsReturnsOpen] = useState(false); // Submenú de Devoluciones

  /**
   * FUNCIÓN PARA MANEJAR SUBMENÚS DE MOVIMIENTOS
   * 
   * Asegura que solo un submenú de movimientos esté abierto a la vez
   * 
   * @param submenu - El submenú que se quiere abrir/cerrar
   */
  const handleMovementSubmenuToggle = (submenu: 'entries' | 'exits' | 'returns') => {
    // CERRAR TODOS LOS OTROS SUBMENÚS
    setIsEntriesOpen(submenu === 'entries' ? !isEntriesOpen : false);
    setIsExitsOpen(submenu === 'exits' ? !isExitsOpen : false);
    setIsReturnsOpen(submenu === 'returns' ? !isReturnsOpen : false);
  };

  /**
   * FUNCIÓN PARA MANEJAR MENÚS PRINCIPALES
   * 
   * Asegura que solo un menú principal esté abierto a la vez
   * 
   * @param menu - El menú principal que se quiere abrir/cerrar
   */
  const handleMainMenuToggle = (menu: 'products' | 'movements') => {
    if (menu === 'products') {
      setIsProductsOpen(!isProductsOpen);
      // CERRAR MENÚ DE MOVIMIENTOS CUANDO SE ABRE PRODUCTOS
      if (!isProductsOpen) {
        setIsMovementsOpen(false);
        setIsEntriesOpen(false);
        setIsExitsOpen(false);
        setIsReturnsOpen(false);
      }
    } else if (menu === 'movements') {
      setIsMovementsOpen(!isMovementsOpen);
      // CERRAR MENÚ DE PRODUCTOS CUANDO SE ABRE MOVIMIENTOS
      if (!isMovementsOpen) {
        setIsProductsOpen(false);
      }
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
      {/* SECCIÓN DEL LOGO */}
      <div className="p-4 border-b border-gray-200 h-16 flex items-center"> {/* ALTURA FIJA h-16 PARA COINCIDIR CON HEADER */}
        <Logo className="w-full" />
      </div>
      
      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="py-4">
        {/* PANEL DE CONTROL */}
        <SidebarItem
          icon={<Home size={18} />}
          label="Panel de Control"
          onClick={() => onNavigate('dashboard')}
          active={currentView === 'dashboard'}
        />
        
        {/* MENÚ DE PRODUCTOS */}
        <SidebarMenu
          icon={<Package size={18} />}
          label="Productos"
          isOpen={isProductsOpen}
          onToggle={() => handleMainMenuToggle('products')}
        >
          {/* LISTA DE PRODUCTOS */}
          <SidebarItem
            icon={<Package size={16} />}
            label="Lista de Productos"
            onClick={() => onNavigate('list')}
            active={currentView === 'list'}
            isSubmenu
          />
          {/* REGISTRAR PRODUCTO */}
          <SidebarItem
            icon={<PlusCircle size={16} />}
            label="Registrar Producto"
            onClick={() => onNavigate('create')}
            active={currentView === 'create'}
            isSubmenu
          />
          {/* CATEGORÍAS */}
          <SidebarItem
            icon={<Tags size={16} />}
            label="Categorías"
            onClick={() => onNavigate('categories')}
            active={currentView === 'categories'}
            isSubmenu
          />
        </SidebarMenu>

        {/* MENÚ DE MOVIMIENTOS DE INVENTARIO */}
        <SidebarMenu
          icon={<FileText size={18} />}
          label="Movimientos de Inventario"
          isOpen={isMovementsOpen}
          onToggle={() => handleMainMenuToggle('movements')}
        >
          {/* SUBMENÚ DE ENTRADAS */}
          <SidebarMenu
            icon={<ArrowUpCircle size={16} />}
            label="Entradas"
            isOpen={isEntriesOpen}
            onToggle={() => handleMovementSubmenuToggle('entries')}
            isSubmenu
          >
            {/* REGISTRAR ENTRADA */}
            <SidebarItem
              icon={<PlusCircle size={14} />}
              label="Registrar Entrada"
              onClick={() => onNavigate('register-entry')}
              active={currentView === 'register-entry'}
              isSubSubmenu
            />
            {/* LISTADO DE ENTRADAS */}
            <SidebarItem
              icon={<List size={14} />}
              label="Listado de Entradas"
              onClick={() => onNavigate('entries-list')}
              active={currentView === 'entries-list'}
              isSubSubmenu
            />
          </SidebarMenu>

          {/* SUBMENÚ DE SALIDAS */}
          <SidebarMenu
            icon={<ArrowDownCircle size={16} />}
            label="Salidas"
            isOpen={isExitsOpen}
            onToggle={() => handleMovementSubmenuToggle('exits')}
            isSubmenu
          >
            {/* REGISTRAR SALIDA */}
            <SidebarItem
              icon={<PlusCircle size={14} />}
              label="Registrar Salida"
              onClick={() => onNavigate('register-exit')}
              active={currentView === 'register-exit'}
              isSubSubmenu
            />
            {/* LISTADO DE SALIDAS */}
            <SidebarItem
              icon={<List size={14} />}
              label="Listado de Salidas"
              onClick={() => onNavigate('exits-list')}
              active={currentView === 'exits-list'}
              isSubSubmenu
            />
          </SidebarMenu>

          {/* SUBMENÚ DE DEVOLUCIONES */}
          <SidebarMenu
            icon={<RotateCcw size={16} />}
            label="Devoluciones"
            isOpen={isReturnsOpen}
            onToggle={() => handleMovementSubmenuToggle('returns')}
            isSubmenu
          >
            {/* REGISTRAR DEVOLUCIÓN */}
            <SidebarItem
              icon={<PlusCircle size={14} />}
              label="Registrar Devolución"
              onClick={() => onNavigate('register-return')}
              active={currentView === 'register-return'}
              isSubSubmenu
            />
            {/* LISTADO DE DEVOLUCIONES */}
            <SidebarItem
              icon={<List size={14} />}
              label="Listado de Devoluciones"
              onClick={() => onNavigate('returns-list')}
              active={currentView === 'returns-list'}
              isSubSubmenu
            />
          </SidebarMenu>
        </SidebarMenu>

        {/* REPORTES */}
        <SidebarItem
          icon={<BarChart3 size={18} />}
          label="Reportes"
          onClick={() => onNavigate('reports')}
          active={currentView === 'reports'}
        />
        
        {/* USUARIOS */}
        <SidebarItem
          icon={<Users size={18} />}
          label="Usuarios"
          onClick={() => onNavigate('users')}
          active={currentView === 'users'}
        />
        
        {/* ALERTAS DE STOCK BAJO */}
        <SidebarItem
          icon={<AlertTriangle size={18} />}
          label="Alertas de Stock Bajo"
          onClick={() => onNavigate('alerts')}
          active={currentView === 'alerts'}
        />
        
        {/* CONFIGURACIÓN */}
        <SidebarItem
          icon={<Settings size={18} />}
          label="Configuración"
          onClick={() => onNavigate('settings')}
          active={currentView === 'settings'}
        />
        
        {/* SECCIÓN DE CERRAR SESIÓN */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <SidebarItem
            icon={<LogOut size={18} />}
            label="Cerrar Sesión"
            onClick={() => onNavigate('logout')}
          />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;