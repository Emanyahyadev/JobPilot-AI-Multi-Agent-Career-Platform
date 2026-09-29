'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#181816] font-sans antialiased overflow-hidden selection:bg-[#181816] selection:text-white print:h-auto print:overflow-visible print:bg-white print:block">
      {/* Permanent Command Center Sidebar */}
      <div className="print:hidden h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Top Navigation Bar */}
        <div className="print:hidden">
          <TopBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        </div>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 print:overflow-visible print:block">
          <div className="max-w-7xl mx-auto print:max-w-none print:m-0 print:p-0">
            {children}
          </div>
        </main>
      </div>

      {/* Global Keyboard Command Center Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
