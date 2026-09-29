'use client';

import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export function AIInsightPanel() {
  const matchedSkills = ['Python', 'FastAPI', 'LLMs', 'React', 'Agentic AI', 'PostgreSQL'];
  const potentialGaps = ['Production MLOps', 'Kubernetes / Cloud Deployment'];

  return (
    <div className="card-base p-5 bg-white border border-[#E4E4DF] rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#E4E4DF] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#181816]" />
          <h3 className="text-sm font-semibold text-[#181816]">Career Signal</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F1F1EE] text-[#6F6F68] border border-[#E4E4DF]">
          High Alignment
        </span>
      </div>

      <p className="text-xs text-[#6F6F68] leading-relaxed">
        Your canonical profile facts indicate strong alignment with <strong className="text-[#181816] font-semibold">AI Engineering</strong> and <strong className="text-[#181816] font-semibold">Senior Full-Stack Architect</strong> roles across remote European and North American markets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* Matched Skills */}
        <div className="space-y-2 bg-[#F7F7F5] p-3 rounded-lg border border-[#E4E4DF]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#181816] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B47]" /> Relevant Confirmed Skills
            </span>
            <span className="text-[10px] font-mono text-[#6F6F68]">6 Matched</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-white text-[#181816] border border-[#E4E4DF]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Gaps */}
        <div className="space-y-2 bg-[#F7F7F5] p-3 rounded-lg border border-[#E4E4DF]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#181816] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#8A5A00]" /> Recommended Focus Gaps
            </span>
            <span className="text-[10px] font-mono text-[#6F6F68]">2 Identified</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {potentialGaps.map((gap, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#FEF8EA] text-[#8A5A00] border border-[#F5E5C0]"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
