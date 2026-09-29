'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    if (pathname === '/') return ['Workspace', 'Overview'];
    if (pathname === '/workspace') return ['Workspace', 'Dashboard'];
    if (pathname === '/profile') return ['Workspace', 'Career Profile Dossier'];
    if (pathname === '/resume') return ['Workspace', 'Resume Studio'];
    if (pathname === '/resume-editor') return ['Resume Studio', 'Editor'];
    if (pathname.startsWith('/jobs')) return ['Workspace', 'Jobs & Market Intelligence'];
    if (pathname.startsWith('/applications')) return ['Workspace', 'Application Studio'];
    if (pathname === '/confirm') return ['Workspace', 'Document Intelligence'];
    if (pathname === '/agent') return ['Automation', 'Career AI Agent'];
    return ['Workspace', 'Overview'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 bg-[#FFFFFF] border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-30 flex-shrink-0 relative">
      {/* Top Brand Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#003366] via-[#1E3A8A] to-[#2563EB]" />
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#64748B] font-medium">{breadcrumbs[0]}</span>
        {breadcrumbs.slice(1).map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="text-[#0F172A] font-bold">{item}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Center Search Command Bar Trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="w-80 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#003366]/50 text-xs flex items-center justify-between transition-all group shadow-2xs hover:shadow-xs"
      >
        <div className="flex items-center gap-2 text-[#64748B] group-hover:text-[#0F172A]">
          <Search className="w-3.5 h-3.5 text-[#003366]" />
          <span className="font-medium">Search workspace, jobs, resumes...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#FFFFFF] text-[#64748B] border border-[#E2E8F0] font-semibold">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-3 text-xs">
        {/* Notifications */}
        <button className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#003366] absolute top-1.5 right-1.5 shadow-[0_0_6px_#003366]" />
        </button>
      </div>

    </header>
  );
}
