import React, { useContext, useState, createContext } from "react";
import { UserInterface, AuthContextProps } from "../types/user";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`useAuth must be use within a provider`);
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInterface | null>(null);

  const login = (userData: UserInterface) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // You can also remove the auth token from cookies here
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
