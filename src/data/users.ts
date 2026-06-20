import { User } from '../types/user';

export const sampleUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'Administrador',
    isActive: true,
    email: 'admin@marketpro.com',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'Anderson Londoño Diossa',
    role: 'Bodega',
    isActive: true,
    email: 'anderson1@marketpro.com',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    username: 'Cristian Rodríguez Ortiz',
    role: 'Cajero',
    isActive: true,
    email: 'cristian@marketpro.com',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    username: 'Cristina Mosquera Cuello',
    role: 'Bodega1',
    isActive: false,
    email: 'cristina@marketpro.com',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '5',
    username: 'Bryan Pinto Umbra',
    role: 'Bodega2',
    isActive: false,
    email: 'bryan@marketpro.com',
    createdAt: new Date('2024-02-15'),
  },
];