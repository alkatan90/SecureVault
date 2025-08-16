import React, { createContext, useContext, useState, useEffect } from 'react';
import { encryptData, decryptData, generateKey } from '../utils/encryption';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (masterPassword: string, biometric?: boolean) => Promise<boolean>;
  logout: () => void;
  setupMasterPassword: (password: string) => Promise<void>;
  hasMasterPassword: () => boolean;
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    // Check for existing session
    const sessionKey = sessionStorage.getItem('pm_session');
    const biometric = localStorage.getItem('pm_biometric_enabled') === 'true';
    
    if (sessionKey) {
      setIsAuthenticated(true);
    }
    
    setBiometricEnabled(biometric);
    setIsLoading(false);
  }, []);

  const hasMasterPassword = () => {
    return localStorage.getItem('pm_master_hash') !== null;
  };

  const setupMasterPassword = async (password: string) => {
    const hash = await generateKey(password);
    localStorage.setItem('pm_master_hash', hash);
    localStorage.setItem('pm_setup_complete', 'true');
  };

  const login = async (masterPassword: string, biometric = false) => {
    try {
      if (biometric && biometricEnabled) {
        // Simulate biometric authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        const sessionKey = crypto.randomUUID();
        sessionStorage.setItem('pm_session', sessionKey);
        sessionStorage.setItem('pm_master_key', await generateKey(masterPassword));
        setIsAuthenticated(true);
        return true;
      }

      const storedHash = localStorage.getItem('pm_master_hash');
      const inputHash = await generateKey(masterPassword);
      
      if (storedHash === inputHash) {
        const sessionKey = crypto.randomUUID();
        sessionStorage.setItem('pm_session', sessionKey);
        sessionStorage.setItem('pm_master_key', inputHash);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    setupMasterPassword,
    hasMasterPassword,
    biometricEnabled,
    setBiometricEnabled
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};