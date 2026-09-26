export type UserRole = 'ADMIN' | 'VOLUNTEER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email?: string;
  password?: string;
}
