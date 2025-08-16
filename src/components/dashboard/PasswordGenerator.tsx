import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Shuffle } from 'lucide-react';
import { usePasswords, PasswordOptions } from '../../contexts/PasswordContext';

export default function PasswordGenerator() {
  const { generateSecurePassword, checkPasswordStrength } = usePasswords();
  
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false
  });
  
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePassword();
  }, [options]);

  const generatePassword = () => {
    const password = generateSecurePassword(options);
    setGeneratedPassword(password);
    setCopied(false);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const passwordStrength = checkPasswordStrength(generatedPassword);
  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400 bg-green-500';
    if (strength >= 60) return 'text-yellow-400 bg-yellow-500';
    return 'text-red-400 bg-red-500';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Medium';
    return 'Weak';
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Password Generator</h2>
        <p className="text-gray-300">Generate secure passwords with customizable options</p>
      </div>

      <div className="space-y-8">
        {/* Generated Password Display */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Generated Password
          </label>
          <div className="relative">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="w-full px-4 py-4 pr-20 bg-white/10 border border-white/20 rounded-xl text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={generatePassword}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Generate new password"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={copyPassword}
                className={`p-2 rounded-lg transition-colors ${
                  copied 
                    ? 'text-green-400 bg-green-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={copied ? 'Copied!' : 'Copy password'}
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Password Strength */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-300">Strength:</span>
                <span className={`text-sm font-semibold ${getStrengthColor(passwordStrength).split(' ')[0]}`}>
                  {getStrengthLabel(passwordStrength)} ({passwordStrength}%)
                </span>
              </div>
              <div className="bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getStrengthColor(passwordStrength).split(' ')[1]}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Generation Options</h3>
          
          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Length</label>
              <span className="text-sm text-white bg-white/10 px-2 py-1 rounded">
                {options.length}
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>6</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Numbers (0-9)</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Symbols (!@#$)</span>
            </label>

            <label className="flex items-center space-x-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Exclude similar characters (1, l, 0, O, i, I)</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4">
          <button
            onClick={generatePassword}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
}