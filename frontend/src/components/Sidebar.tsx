'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Send,
  ShieldCheck,
  Bot,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  Activity,
  Settings,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { apiFetch, removeAuthToken } from '@/lib/api';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Career Explorer');
  const [userEmail, setUserEmail] = useState('');
  const [userHeadline, setUserHeadline] = useState('Professional');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const prof = await apiFetch('/profiles/me');
        if (prof?.personal?.name) {
          setUserName(prof.personal.name);
        }
        if (prof?.personal?.email) {
          setUserEmail(prof.personal.email);
        }
        if (prof?.professional?.headline) {
          setUserHeadline(prof.professional.headline);
        }
      } catch (e) {
        if (typeof window !== 'undefined') {
          const storedEmail = localStorage.getItem('user_email');
          if (storedEmail) {
            setUserEmail(storedEmail);
            setUserName(storedEmail.split('@')[0]);
          }
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  const workspaceNav = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Career Profile', href: '/profile', icon: User },
    { name: 'Resume Studio', href: '/resume', icon: FileText },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Applications', href: '/applications', icon: Send },
    { name: 'Document Intelligence', href: '/confirm', icon: ShieldCheck },
  ];

  const automationNav = [
    { name: 'Career Counsellor AI', href: '/agent', icon: Bot, badge: 'NVIDIA' },
  ];

  const bottomNav = [
    { name: 'Settings', href: '/profile', icon: Settings },
    { name: 'Help & Architecture', href: '#', icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-[250px] bg-[#FFFFFF] border-r border-[#E4E4DF] flex flex-col h-full flex-shrink-0 select-none">
      
      {/* Brand Header */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
        <Link href="/" className="flex items-center gap-2 group w-full">
          <img
            src="/logo.png"
            alt="JobPilot AI"
            className="h-10 w-auto max-w-[190px] object-contain"
          />
        </Link>
      </div>

      {/* Navigation Scroll Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {/* Section 1: Workspace */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
            Workspace
          </div>
          {workspaceNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#E8EFF6] via-[#F1F5F9] to-transparent text-[#003366] font-bold border-l-3 border-l-[#003366] shadow-2xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#003366]' : 'text-[#94A3B8]'}`} />
                  <span>{item.name}</span>
                </div>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003366] shadow-[0_0_6px_#003366]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Section 2: AI Counsellor */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
            AI Intelligence
          </div>
          {automationNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#E8EFF6] via-[#F1F5F9] to-transparent text-[#003366] font-bold border-l-3 border-l-[#003366] shadow-2xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#003366]' : 'text-[#94A3B8]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#003366] text-white shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Live Market Feeds Indicator */}
        <div className="p-3 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#003366] animate-pulse shadow-[0_0_6px_#003366]" />
              Live Market Systems
            </span>
            <span className="text-[10px] font-mono font-bold text-[#003366] bg-[#E8EFF6] px-1.5 py-0.2 rounded">200 OK</span>
          </div>
          <div className="text-[10px] text-[#64748B] leading-tight space-y-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[#003366]">✦</span> SerpAPI Google Jobs
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#003366]">✦</span> In-Code Python Mailer
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#003366]">✦</span> NVIDIA NIM LLM
            </div>
          </div>
        </div>

      </div>

      {/* Footer Navigation & Profile */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#FFFFFF] space-y-2">
        <div className="space-y-0.5">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Authenticated User Card */}
        <div className="p-2 rounded-xl bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-[#0F172A] block truncate leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-[#64748B] block truncate font-mono font-medium">
                {userHeadline}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1 hover:bg-[#E2E8F0] rounded-md text-[#64748B] hover:text-[#B91C1C] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
