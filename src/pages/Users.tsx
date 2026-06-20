import React, { useState } from 'react';
import { UserPlus, Edit2, Power, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import { sampleUsers } from '../data/users';
import type { User } from '../types/user';

interface UsersProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Users: React.FC<UsersProps> = ({ currentView, onNavigate }) => {
  const [users, setUsers] = useState<User[]>(sampleUsers);

  const handleCreateUser = () => {
    console.log('Create new user');
    // Here you would typically open a modal or navigate to a create user form
  };

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
    // Here you would typically open a modal or navigate to an edit user form
  };

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    console.log(`${currentStatus ? 'Deactivating' : 'Activating'} user:`, userId);
    // Here you would typically make an API call to update the user's status
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !currentStatus }
        : user
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Usuarios</h1>
        <Button
          onClick={handleCreateUser}
          className="flex items-center gap-2"
        >
          <UserPlus size={18} />
          Crear Usuario
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-800' : ''}
                    ${user.role === 'Bodega' ? 'bg-blue-100 text-blue-800' : ''}
                    ${user.role === 'Cajero' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${user.isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                      className={`
                        ${user.isActive 
                          ? 'text-error-500 hover:text-error-600' 
                          : 'text-success-500 hover:text-success-600'}
                      `}
                    >
                      {user.isActive ? <Power size={16} /> : <Check size={16} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;