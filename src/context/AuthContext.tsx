
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/lib/mockData';

interface AuthContextType {
  currentUser: User;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize with the Admin user from Phase 1 mock data as default
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [activeRole, setActiveRole] = useState<UserRole>(mockUsers[0].role);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const switchRole = (role: UserRole) => {
    const matchedUser = mockUsers.find((user) => user.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setActiveRole(role);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, activeRole, switchRole, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be executed inside an AuthProvider element structure.');
  }
  return context;
}