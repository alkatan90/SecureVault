import React, { useState } from 'react';
import { X, Fingerprint, Shield, Bell, Smartphone, Download, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { biometricEnabled, setBiometricEnabled, logout } = useAuth();
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState(15);
  const [breachAlertsEnabled, setBreachAlertsEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const handleExportData = () => {
    // In a real app, this would export encrypted data
    const data = {
      version: '1.0',
      exported: new Date().toISOString(),
      note: 'This is a simulated export for demonstration purposes'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'securevault-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Authentication Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Authentication & Security
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Biometric Login</div>
                    <div className="text-sm text-gray-400">Use fingerprint or face recognition to unlock</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={biometricEnabled}
                    onChange={(e) => setBiometricEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-medium text-white">Auto-Lock</div>
                      <div className="text-sm text-gray-400">Automatically lock the app after inactivity</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoLockEnabled}
                      onChange={(e) => setAutoLockEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {autoLockEnabled && (
                  <div className="mt-3">
                    <label className="block text-sm text-gray-300 mb-2">
                      Lock after: {autoLockTime} minutes
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={autoLockTime}
                      onChange={(e) => setAutoLockTime(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <div className="font-medium text-white">Breach Alerts</div>
                  <div className="text-sm text-gray-400">Get notified when your passwords are found in breaches</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={breachAlertsEnabled}
                    onChange={(e) => setBreachAlertsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Sync & Backup */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Sync & Backup
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <div className="font-medium text-white">Cross-Device Sync</div>
                  <div className="text-sm text-gray-400">Sync your passwords across all devices (Simulated)</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncEnabled}
                    onChange={(e) => setSyncEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white"
                >
                  <Download className="w-5 h-5" />
                  Export Data
                </button>
                
                <button className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white">
                  <Upload className="w-5 h-5" />
                  Import Data
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
            
            <div className="space-y-4">
              <button
                onClick={logout}
                className="w-full p-4 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 rounded-xl transition-colors text-red-200 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-center text-sm text-gray-400">
            SecureVault v1.0 - Your data is encrypted and secure
          </div>
        </div>
      </div>
    </div>
  );
}