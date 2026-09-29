'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Briefcase,
  FileText,
  User,
  Send,
  Building2,
  CheckSquare,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = RouterHook();
  const [query, setQuery] = useState('');

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands: CommandItem[] = [
    {
      id: 'jobs-search',
      title: 'Discover & Search Live Jobs',
      category: 'Jobs',
      icon: Search,
      shortcut: '↵',
      action: () => {
        router.push('/jobs');
        onClose();
      },
    },
    {
      id: 'resume-studio',
      title: 'Open Resume Studio & Tailor CV',
      category: 'Resumes',
      icon: FileText,
      action: () => {
        router.push('/resume');
        onClose();
      },
    },
    {
      id: 'applications',
      title: 'Open Application Workspace & Gmail Drafts',
      category: 'Applications',
      icon: Send,
      action: () => {
        router.push('/applications');
        onClose();
      },
    },
    {
      id: 'career-profile',
      title: 'View Canonical Career Profile Dossier',
      category: 'Profile',
      icon: User,
      action: () => {
        router.push('/profile');
        onClose();
      },
    },
    {
      id: 'document-intelligence',
      title: 'Document Intelligence & Fact Confirmation',
      category: 'Documents',
      icon: CheckSquare,
      action: () => {
        router.push('/confirm');
        onClose();
      },
    },
    {
      id: 'agent-chat',
      title: 'Launch Autonomous Career AI Agent',
      category: 'AI Assistant',
      icon: Sparkles,
      action: () => {
        router.push('/agent');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#111110]/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-white border border-[#E4E4DF] rounded-xl shadow-2xl overflow-hidden animate-slide-in">
        
        {/* Search Header */}
        <div className="relative border-b border-[#E4E4DF] flex items-center px-4 py-3 bg-[#F7F7F5]">
          <Search className="w-4 h-4 text-[#6F6F68] mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workspace... (e.g. Jobs, Resume, Profile)"
            className="w-full bg-transparent text-sm text-[#181816] placeholder-[#999990] focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#999990] hover:text-[#181816] hover:bg-[#E4E4DF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#F1F1EE] text-left text-xs transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-[#F1F1EE] group-hover:bg-white text-[#181816] border border-[#E4E4DF]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-medium text-[#181816] block">{cmd.title}</span>
                      <span className="text-[11px] text-[#999990]">{cmd.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#999990] group-hover:text-[#181816] transition-colors text-[11px] font-mono">
                    <span>Jump</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-[#6F6F68]">
              No command matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#F7F7F5] border-t border-[#E4E4DF] flex items-center justify-between text-[11px] text-[#6F6F68] font-mono">
          <span>Navigate with 🡱 🡳</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}

function RouterHook() {
  return useRouter();
}
