import React, { useState } from 'react';
import { UserPlus, Edit2, Power, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import type { User } from '../types/user';

interface UsersProps {
  currentView: string;
  onNavigate: (view: string) => void;
  users: User[];               
  onAddUser: (user: any) => void; 
  onToggleStatus: (userId: string) => void; 
  onUpdateUser: (userId: string, updatedData: any | null) => void; 
}

const Users: React.FC<UsersProps> = ({ 
  currentView, 
  onNavigate, 
  users, 
  onAddUser = () => {},
  onToggleStatus,
  onUpdateUser
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Cajero');
  const [password, setPassword] = useState('');

  const handleCreateUserClick = () => {
    setIsCreating(true);
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return; 

    onAddUser({
      username,
      email,
      role,
      password, 
      isActive: true
    });

    setUsername('');
    setEmail('');
    setRole('Cajero');
    setPassword(''); 
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 max-w-4xl mx-auto">
      
      {/* SECCIÓN 1: FORMULARIO DE REGISTRO RESPONSIVO */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Registrar Nuevo Usuario</h2>
          
          <form onSubmit={handleSubmitUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                placeholder="ej. eduar.ruiz"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                placeholder="ejemplo@marketpro.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña de Ingreso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                placeholder="Asigna una clave"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol del Sistema</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm"
              >
                <option value="Administrador">Administrador</option>
                <option value="Bodega">Bodega</option>
                <option value="Cajero">Cajero</option>
              </select>
            </div>
            
            <div className="md:col-span-4 flex flex-col-reverse sm:flex-row justify-end gap-2 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Guardar Usuario
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* SECCIÓN 2: TABLA CON SCROLL HORIZONTAL CONTROLADO */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Administración de Usuarios</h1>
          {!isCreating && (
            <Button
              onClick={handleCreateUserClick}
              className="flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <UserPlus size={18} />
              Crear Usuario
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto min-w-full block">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(users || []).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.username}</div>
                    <div className="block sm:hidden text-xs text-gray-400 mt-0.5">{user.email}</div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`
                      px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-800' : ''}
                      ${String(user.role || '').includes('Bodega') ? 'bg-blue-100 text-blue-800' : ''}
                      ${user.role === 'Cajero' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {String(user.role || 'Usuario')}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`
                      px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right font-medium">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const opcion = prompt(
                            `Administrar usuario: "${user.username}"\n\nEscribe "1" para editar Nombre y Rol.\nEscribe "ELIMINAR" para borrar este usuario.`
                          );
                          
                          if (opcion === "1") {
                            const nuevoNombre = prompt("Modificar nombre de usuario:", user.username);
                            const nuevoRol = prompt("Modificar rol (Administrador, Bodega, Cajero):", user.role);
                            if (nuevoNombre && nuevoRol) {
                              onUpdateUser(user.id, { username: nuevoNombre, role: nuevoRol });
                            }
                          } else if (opcion?.toUpperCase() === "ELIMINAR") {
                            if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${user.username}?`)) {
                              onUpdateUser(user.id, null);
                            }
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1.5"
                        title="Editar o Eliminar"
                      >
                        <Edit2 size={15} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const accion = user.isActive ? 'desactivar' : 'activar';
                          if (confirm(`¿Estás seguro de que deseas ${accion} al usuario "${user.username}"?`)) {
                            onToggleStatus(user.id);
                          }
                        }}
                        className={`${user.isActive ? 'text-red-500' : 'text-green-600'} p-1.5`}
                        title={user.isActive ? "Desactivar" : "Activar"}
                      >
                        {user.isActive ? <Power size={15} /> : <Check size={15} />}
                      </Button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
