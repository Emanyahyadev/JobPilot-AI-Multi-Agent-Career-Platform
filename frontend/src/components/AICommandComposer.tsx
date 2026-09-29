'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Search, FileText, Send, Briefcase } from 'lucide-react';

interface AICommandComposerProps {
  placeholder?: string;
  className?: string;
}

export function AICommandComposer({
  placeholder = "What would you like to accomplish? (e.g., 'Find remote AI Engineer roles in Europe', 'Tailor my resume for this job')",
  className = ''
}: AICommandComposerProps) {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const suggestions = [
    { label: "Find remote AI Engineer roles", action: () => router.push('/jobs?query=Remote+AI+Engineer') },
    { label: "Audit resume for ATS", action: () => router.push('/resume') },
    { label: "Prepare job application", action: () => router.push('/applications') },
    { label: "Review career profile", action: () => router.push('/profile') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // Route to jobs or agent with query
    router.push(`/jobs?query=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <div className={`card-base p-5 bg-white border border-[#E4E4DF] rounded-xl shadow-xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#181816] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#181816]" /> AI Command Composer
        </span>
        <span className="text-[11px] font-mono text-[#6F6F68]">
          Grounded Provenance Active
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={2}
          placeholder={placeholder}
          className="w-full bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl p-3.5 pr-28 text-sm text-[#181816] placeholder-[#999990] focus:outline-none focus:border-[#181816] font-sans leading-relaxed resize-none transition-all"
        />

        <button
          type="submit"
          disabled={!prompt.trim()}
          className={`absolute right-3 bottom-3 px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all ${
            prompt.trim()
              ? 'bg-[#181816] text-white hover:bg-[#2B2B28] shadow-xs'
              : 'bg-[#E4E4DF] text-[#999990] cursor-not-allowed'
          }`}
        >
          <span>Send</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-[#999990] text-[11px] font-mono">Examples:</span>
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(item.label);
              item.action();
            }}
            className="px-2.5 py-1 rounded-md bg-[#F1F1EE] hover:bg-[#E4E4DF] border border-[#E4E4DF] text-[#181816] text-[11px] font-medium transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
