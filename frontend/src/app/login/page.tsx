'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === 'signup' ? `${API_URL}/auth/register` : `${API_URL}/auth/login`;
      const bodyPayload = mode === 'signup'
        ? { email, password, name: name.trim() || undefined }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed. Please check your credentials.');
      }

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (data.email) localStorage.setItem('user_email', data.email);
        router.push('/');
      } else {
        // If registered successfully without auto token, log in immediately
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.access_token) {
          localStorage.setItem('access_token', loginData.access_token);
          if (loginData.email) localStorage.setItem('user_email', loginData.email);
          router.push('/');
        } else {
          setMode('login');
          setError('Account created! Please sign in with your password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B132B] flex items-center justify-center p-6 text-[#0F172A] font-sans antialiased relative overflow-hidden">
      {/* Background Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0EA5E9]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-3xl space-y-6 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-xs border border-[#E2E8F0]">
            <img
              src="/logo.png"
              alt="JobPilot AI"
              className="h-14 w-auto object-contain mx-auto"
            />
          </div>
          <p className="text-xs text-[#64748B] font-medium">Enterprise AI Career Operating System</p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LogIn className={`w-3.5 h-3.5 ${mode === 'login' ? 'text-[#003366]' : ''}`} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <UserPlus className={`w-3.5 h-3.5 ${mode === 'signup' ? 'text-[#003366]' : ''}`} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs text-[#B91C1C] flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F172A]">Full Name</label>
              <input
                type="text"
                required={mode === 'signup'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-all"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@example.com"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#003366] to-[#1E3A8A] hover:from-[#002244] hover:to-[#003366] text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : mode === 'signup' ? 'Create Career Workspace' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Credentials Pill */}
        <div className="p-3 bg-[#E8EFF6] rounded-xl border border-[#003366]/20 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#003366] text-[11px]">Instant Demo Credentials:</span>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setEmail('demo@jobpilot.com');
                setPassword('jobpilot123');
              }}
              className="text-[11px] font-bold text-[#0284C7] hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-[#BAE6FD] shadow-2xs"
            >
              Fill Demo Login
            </button>
          </div>
          <div className="text-[11px] font-mono text-[#475569] space-y-0.5">
            <div>Email: <strong className="text-[#0F172A]">demo@jobpilot.com</strong></div>
            <div>Password: <strong className="text-[#0F172A]">jobpilot123</strong></div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E2E8F0] text-center text-[11px] text-[#64748B] font-mono flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>JWT Secure Authentication Active</span>
        </div>

      </div>
    </div>
  );
}
