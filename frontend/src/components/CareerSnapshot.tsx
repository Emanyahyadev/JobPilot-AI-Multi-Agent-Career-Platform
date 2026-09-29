'use client';

import React from 'react';
import Link from 'next/link';
import { User, FileText, Bookmark, Send, Calendar, CheckCircle2 } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  href: string;
  icon: React.ElementType;
}

function MetricItem({ label, value, sublabel, href, icon: Icon }: MetricCardProps) {
  return (
    <Link
      href={href}
      className="card-base p-4 bg-white border border-[#E4E4DF] rounded-xl hover:border-[#D4D4CE] transition-all group hover:shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center justify-between text-[#6F6F68]">
        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#999990]">
          {label}
        </span>
        <Icon className="w-3.5 h-3.5 text-[#999990] group-hover:text-[#181816] transition-colors" />
      </div>

      <div className="my-2">
        <div className="text-2xl font-bold tracking-tight text-[#181816] font-sans">
          {value}
        </div>
        <div className="text-xs text-[#6F6F68] font-medium mt-0.5">
          {sublabel}
        </div>
      </div>
    </Link>
  );
}

export function CareerSnapshot() {
  const metrics = [
    {
      label: 'Profile',
      value: '92%',
      sublabel: 'Complete Dossier',
      href: '/profile',
      icon: User,
    },
    {
      label: 'Resumes',
      value: '4',
      sublabel: 'Tailored Versions',
      href: '/resume',
      icon: FileText,
    },
    {
      label: 'Saved',
      value: '18',
      sublabel: 'Target Opportunities',
      href: '/jobs',
      icon: Bookmark,
    },
    {
      label: 'Active',
      value: '5',
      sublabel: 'Applications Saved',
      href: '/applications',
      icon: Send,
    },
    {
      label: 'Interviews',
      value: '2',
      sublabel: 'Scheduled Stage',
      href: '/applications',
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#999990] font-semibold">
          Career Snapshot
        </h3>
        <span className="text-xs text-[#2E6B47] font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 14 Facts Verified
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {metrics.map((m, idx) => (
          <MetricItem key={idx} {...m} />
        ))}
      </div>
    </div>
  );
}
