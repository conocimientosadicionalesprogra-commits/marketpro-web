export type UserRole = "Administrador" | "Bodega" | "Cajero";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  email: string;
  createdAt: Date;
}

export const USER_ROLES: UserRole[] = ["Administrador", "Bodega", "Cajero"];