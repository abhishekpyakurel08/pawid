import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginPayload } from '../types/auth';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          const token = authService.getToken() || '';
          setAuth(currentUser, token);
        } catch {
          authService.logout();
          storeLogout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [setAuth, storeLogout]);

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      setAuth(res.user, res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    storeLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
