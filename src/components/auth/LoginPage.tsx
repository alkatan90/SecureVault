import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Fingerprint, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { login, setupMasterPassword, hasMasterPassword, biometricEnabled } = useAuth();

  const needsSetup = !hasMasterPassword();

  const handleSubmit = async (e: React.FormEvent, biometric = false) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (needsSetup || isSetup) {
        if (masterPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (masterPassword.length < 8) {
          setError('Master password must be at least 8 characters');
          return;
        }
        await setupMasterPassword(masterPassword);
        setIsSetup(false);
      }

      const success = await login(masterPassword, biometric);
      if (!success) {
        setError('Invalid master password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricEnabled) return;
    setIsLoading(true);
    
    try {
      // Simulate biometric prompt
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = await login('demo-password', true); // In real app, would use stored password
      if (!success) {
        setError('Biometric authentication failed');
      }
    } catch (err) {
      setError('Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">SecureVault</h1>
            <p className="text-gray-300">
              {needsSetup || isSetup ? 'Set up your master password' : 'Enter your master password'}
            </p>
          </div>

          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your master password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {(needsSetup || isSetup) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your master password"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {needsSetup || isSetup ? 'Create Master Password' : 'Unlock Vault'}
                  </>
                )}
              </button>

              {biometricEnabled && !needsSetup && !isSetup && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-transparent px-2 text-gray-400">or</span>
                  </div>
                </div>
              )}

              {biometricEnabled && !needsSetup && !isSetup && (
                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={isLoading}
                  className="w-full bg-white/10 border border-white/20 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-5 h-5" />
                  Use Biometric Login
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Your data is encrypted with AES-256 encryption and never leaves your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}