import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Edit, Trash2, ExternalLink, Star, Shield, AlertTriangle } from 'lucide-react';
import { PasswordEntry, usePasswords } from '../../contexts/PasswordContext';
import EditPasswordModal from './EditPasswordModal';

interface PasswordListProps {
  passwords: PasswordEntry[];
}

export default function PasswordList({ passwords }: PasswordListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const { updatePassword, deletePassword } = usePasswords();

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // In a real app, you'd show a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleFavorite = async (password: PasswordEntry) => {
    await updatePassword(password.id, { favorite: !password.favorite });
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return 'Strong';
    if (strength >= 60) return 'Medium';
    return 'Weak';
  };

  if (passwords.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No passwords found</h3>
        <p className="text-gray-400">Add your first password to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {passwords.map((password) => (
        <div
          key={password.id}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white truncate">{password.name}</h3>
                
                <div className="flex items-center gap-2">
                  {password.favorite && (
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  )}
                  
                  {password.breached && (
                    <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 rounded px-2 py-1">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-200">Breached</span>
                    </div>
                  )}
                  
                  <div className={`text-xs font-medium ${getStrengthColor(password.strength)}`}>
                    {getStrengthLabel(password.strength)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-20">Username:</span>
                  <span className="text-white">{password.username}</span>
                  <button
                    onClick={() => copyToClipboard(password.username, 'username')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-20">Password:</span>
                  <span className="text-white font-mono">
                    {visiblePasswords.has(password.id) ? password.password : '••••••••'}
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(password.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {visiblePasswords.has(password.id) ? 
                      <EyeOff className="w-4 h-4" /> : 
                      <Eye className="w-4 h-4" />
                    }
                  </button>
                  <button
                    onClick={() => copyToClipboard(password.password, 'password')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {password.url && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-20">URL:</span>
                    <a
                      href={password.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      {password.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-20">Category:</span>
                  <span className="bg-purple-500/20 border border-purple-500/30 rounded px-2 py-1 text-xs text-purple-200">
                    {password.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => toggleFavorite(password)}
                className={`p-2 rounded-lg transition-colors ${
                  password.favorite
                    ? 'text-yellow-400 hover:bg-yellow-500/20'
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20'
                }`}
              >
                <Star className={`w-4 h-4 ${password.favorite ? 'fill-yellow-400' : ''}`} />
              </button>
              
              <button
                onClick={() => setEditingPassword(password)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => deletePassword(password.id)}
                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {password.notes && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-300">{password.notes}</p>
            </div>
          )}
        </div>
      ))}

      {editingPassword && (
        <EditPasswordModal
          password={editingPassword}
          onClose={() => setEditingPassword(null)}
        />
      )}
    </div>
  );
}