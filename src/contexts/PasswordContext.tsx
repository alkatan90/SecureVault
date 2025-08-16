import React, { createContext, useContext, useState, useEffect } from 'react';
import { encryptData, decryptData } from '../utils/encryption';

export interface PasswordEntry {
  id: string;
  name: string;
  username: string;
  password: string;
  url: string;
  category: string;
  notes: string;
  favorite: boolean;
  lastModified: Date;
  strength: number;
  breached: boolean;
}

interface PasswordContextType {
  passwords: PasswordEntry[];
  categories: string[];
  addPassword: (entry: Omit<PasswordEntry, 'id' | 'lastModified'>) => Promise<void>;
  updatePassword: (id: string, entry: Partial<PasswordEntry>) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
  getPassword: (id: string) => PasswordEntry | undefined;
  searchPasswords: (query: string) => PasswordEntry[];
  loadPasswords: () => Promise<void>;
  generateSecurePassword: (options: PasswordOptions) => string;
  checkPasswordStrength: (password: string) => number;
}

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export function PasswordProvider({ children }: { children: React.ReactNode }) {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [categories] = useState(['Work', 'Personal', 'Finance', 'Social', 'Shopping', 'Entertainment']);

  const loadPasswords = async () => {
    try {
      const encryptedData = localStorage.getItem('pm_passwords');
      if (encryptedData) {
        const masterKey = sessionStorage.getItem('pm_master_key');
        if (masterKey) {
          const decryptedData = await decryptData(encryptedData, masterKey);
          const passwordData = JSON.parse(decryptedData);
          setPasswords(passwordData.map((p: any) => ({
            ...p,
            lastModified: new Date(p.lastModified)
          })));
        }
      }
    } catch (error) {
      console.error('Error loading passwords:', error);
    }
  };

  const savePasswords = async (passwordList: PasswordEntry[]) => {
    try {
      const masterKey = sessionStorage.getItem('pm_master_key');
      if (masterKey) {
        const encryptedData = await encryptData(JSON.stringify(passwordList), masterKey);
        localStorage.setItem('pm_passwords', encryptedData);
      }
    } catch (error) {
      console.error('Error saving passwords:', error);
    }
  };

  const addPassword = async (entry: Omit<PasswordEntry, 'id' | 'lastModified'>) => {
    const newPassword: PasswordEntry = {
      ...entry,
      id: crypto.randomUUID(),
      lastModified: new Date(),
      strength: checkPasswordStrength(entry.password),
      breached: Math.random() < 0.05 // 5% chance of being "breached" for demo
    };

    const updatedPasswords = [...passwords, newPassword];
    setPasswords(updatedPasswords);
    await savePasswords(updatedPasswords);
  };

  const updatePassword = async (id: string, entry: Partial<PasswordEntry>) => {
    const updatedPasswords = passwords.map(p => 
      p.id === id 
        ? { 
            ...p, 
            ...entry, 
            lastModified: new Date(),
            strength: entry.password ? checkPasswordStrength(entry.password) : p.strength
          }
        : p
    );
    setPasswords(updatedPasswords);
    await savePasswords(updatedPasswords);
  };

  const deletePassword = async (id: string) => {
    const updatedPasswords = passwords.filter(p => p.id !== id);
    setPasswords(updatedPasswords);
    await savePasswords(updatedPasswords);
  };

  const getPassword = (id: string) => {
    return passwords.find(p => p.id === id);
  };

  const searchPasswords = (query: string) => {
    const searchTerm = query.toLowerCase();
    return passwords.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.username.toLowerCase().includes(searchTerm) ||
      p.url.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  };

  const generateSecurePassword = (options: PasswordOptions) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similar = '1l0OiI';

    let chars = '';
    if (options.includeUppercase) chars += uppercase;
    if (options.includeLowercase) chars += lowercase;
    if (options.includeNumbers) chars += numbers;
    if (options.includeSymbols) chars += symbols;

    if (options.excludeSimilar) {
      chars = chars.split('').filter(c => !similar.includes(c)).join('');
    }

    let password = '';
    for (let i = 0; i < options.length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    
    // Length check
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else if (password.length >= 6) score += 5;

    // Character variety
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    // Patterns
    if (!/(.)\1{2,}/.test(password)) score += 10; // No repeated characters
    if (!/012|123|234|345|456|567|678|789|890|abc|bcd|cde/.test(password.toLowerCase())) score += 5;

    return Math.min(100, score);
  };

  useEffect(() => {
    loadPasswords();
  }, []);

  const value = {
    passwords,
    categories,
    addPassword,
    updatePassword,
    deletePassword,
    getPassword,
    searchPasswords,
    loadPasswords,
    generateSecurePassword,
    checkPasswordStrength
  };

  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  );
}

export const usePasswords = () => {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error('usePasswords must be used within a PasswordProvider');
  }
  return context;
};