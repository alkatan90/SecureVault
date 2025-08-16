import React, { useState } from 'react';
import { Shield, Plus, Search, Settings, LogOut, Star, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePasswords } from '../../contexts/PasswordContext';
import PasswordList from './PasswordList';
import AddPasswordModal from './AddPasswordModal';
import PasswordGenerator from './PasswordGenerator';
import SecurityDashboard from './SecurityDashboard';
import SettingsModal from './SettingsModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('passwords');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { logout } = useAuth();
  const { passwords, categories, searchPasswords } = usePasswords();

  const filteredPasswords = searchQuery 
    ? searchPasswords(searchQuery)
    : passwords.filter(p => {
        const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
        const favoriteMatch = !showFavoritesOnly || p.favorite;
        return categoryMatch && favoriteMatch;
      });

  const weakPasswords = passwords.filter(p => p.strength < 60).length;
  const breachedPasswords = passwords.filter(p => p.breached).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">SecureVault</h1>
            </div>

            <div className="flex items-center gap-4">
              {(weakPasswords > 0 || breachedPasswords > 0) && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-200">
                    {weakPasswords + breachedPasswords} security issues
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('passwords')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'passwords'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  All Passwords ({passwords.length})
                </button>
                
                <button
                  onClick={() => setActiveTab('generator')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'generator'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Password Generator
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'security'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Security Dashboard
                </button>
              </nav>

              {activeTab === 'passwords' && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Filters</span>
                      <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`p-1 rounded transition-colors ${
                          showFavoritesOnly
                            ? 'text-yellow-400'
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category} className="bg-gray-800">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'passwords' && (
              <div className="space-y-6">
                {/* Search and Add Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search passwords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    Add Password
                  </button>
                </div>

                <PasswordList passwords={filteredPasswords} />
              </div>
            )}

            {activeTab === 'generator' && <PasswordGenerator />}
            {activeTab === 'security' && <SecurityDashboard />}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddPasswordModal onClose={() => setShowAddModal(false)} />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}