import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserProfile, LoginCredentials, RegisterPayload, AuthContextType } from "../types/auth";
import { api } from "../services/api";

export type { UserProfile };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("ecoverzz_access_token"));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-login / verify existing JWT token on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("ecoverzz_access_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const profile = await api.getProfile();
        setUser(profile);
        setToken(storedToken);
      } catch (err: any) {
        console.warn("Auto-login failed or token expired:", err);
        api.logout();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (emailOrCredentials: string | LoginCredentials, password?: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const profile = await api.login(emailOrCredentials, password);
      const currentToken = localStorage.getItem("ecoverzz_access_token");
      setUser(profile);
      setToken(currentToken);
      return profile;
    } catch (err: any) {
      const msg = err.message || "Authentication failed. Invalid email or password.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const profile = await api.register(payload);
      const currentToken = localStorage.getItem("ecoverzz_access_token");
      setUser(profile);
      setToken(currentToken);
      return profile;
    } catch (err: any) {
      const msg = err.message || "Registration failed. Please check your details.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
