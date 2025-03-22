'use client';

import { createContext, useContext } from 'react';

const AuthContext = createContext({ isAuthenticated: false });

export function AuthProvider({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) {
  return (
      <AuthContext.Provider value={{ isAuthenticated }}>
        {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
