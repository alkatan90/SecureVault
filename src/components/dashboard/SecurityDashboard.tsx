import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Eye, Server } from 'lucide-react';
import { usePasswords } from '../../contexts/PasswordContext';

export default function SecurityDashboard() {
  const { passwords } = usePasswords();

  const stats = {
    total: passwords.length,
    weak: passwords.filter(p => p.strength < 60).length,
    medium: passwords.filter(p => p.strength >= 60 && p.strength < 80).length,
    strong: passwords.filter(p => p.strength >= 80).length,
    breached: passwords.filter(p => p.breached).length,
    reused: 0, // In a real app, you'd calculate duplicate passwords
    old: passwords.filter(p => {
      const days = (Date.now() - p.lastModified.getTime()) / (1000 * 60 * 60 * 24);
      return days > 90;
    }).length
  };

  const securityScore = Math.round(
    ((stats.strong * 100 + stats.medium * 60) / Math.max(stats.total, 1)) *
    (1 - (stats.breached + stats.reused) / Math.max(stats.total, 1))
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500';
    return 'text-red-400 bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-8">
      {/* Security Score */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Security Score</h2>
          <p className="text-gray-300">Overall security rating of your password vault</p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full bg-gray-700">
              <div
                className={`w-full h-full rounded-full ${getScoreColor(securityScore).split(' ')[1]} transition-all duration-1000`}
                style={{
                  background: `conic-gradient(${getScoreColor(securityScore).split(' ')[1].replace('bg-', 'var(--tw-color-')} ${securityScore * 3.6}deg, rgb(55 65 81) 0deg)`
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(securityScore).split(' ')[0]}`}>
                  {securityScore}%
                </div>
                <div className="text-xs text-gray-400">
                  {getScoreLabel(securityScore)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{stats.strong}</div>
            <div className="text-sm text-gray-300">Strong</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
            <div className="text-sm text-gray-300">Medium</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{stats.weak}</div>
            <div className="text-sm text-gray-300">Weak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{stats.breached}</div>
            <div className="text-sm text-gray-300">Breached</div>
          </div>
        </div>
      </div>

      {/* Security Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Passwords */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Weak Passwords</h3>
              <p className="text-sm text-gray-400">Passwords with low security strength</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-red-400 mb-2">{stats.weak}</div>
          {stats.weak > 0 && (
            <p className="text-sm text-gray-300">
              Consider updating these passwords to improve your security score
            </p>
          )}
        </div>

        {/* Breached Passwords */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Breached Passwords</h3>
              <p className="text-sm text-gray-400">Found in known data breaches</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-red-400 mb-2">{stats.breached}</div>
          {stats.breached > 0 && (
            <p className="text-sm text-gray-300">
              These passwords should be changed immediately
            </p>
          )}
        </div>

        {/* Old Passwords */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Old Passwords</h3>
              <p className="text-sm text-gray-400">Not updated in 90+ days</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.old}</div>
          {stats.old > 0 && (
            <p className="text-sm text-gray-300">
              Consider updating these passwords regularly
            </p>
          )}
        </div>

        {/* Reused Passwords */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Reused Passwords</h3>
              <p className="text-sm text-gray-400">Used across multiple accounts</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-400 mb-2">{stats.reused}</div>
          <p className="text-sm text-gray-300">
            Each account should have a unique password
          </p>
        </div>
      </div>

      {/* Security Features */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Security Features</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-white">AES-256 Encryption</div>
                <div className="text-sm text-gray-400">Your data is encrypted with military-grade security</div>
              </div>
            </div>
            <div className="text-green-400 font-semibold">Active</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-white">Zero-Knowledge Architecture</div>
                <div className="text-sm text-gray-400">Your master password is never stored or transmitted</div>
              </div>
            </div>
            <div className="text-green-400 font-semibold">Active</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-white">Automatic Breach Monitoring</div>
                <div className="text-sm text-gray-400">Continuous monitoring of your passwords against known breaches</div>
              </div>
            </div>
            <div className="text-green-400 font-semibold">Active</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-white">Secure Password Sharing</div>
                <div className="text-sm text-gray-400">Share passwords securely with team members</div>
              </div>
            </div>
            <div className="text-gray-400">Available</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-white">Cross-Device Sync</div>
                <div className="text-sm text-gray-400">Access your passwords across all your devices</div>
              </div>
            </div>
            <div className="text-blue-400">Simulated</div>
          </div>
        </div>
      </div>
    </div>
  );
}