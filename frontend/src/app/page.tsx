'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { apiFetch } from '@/lib/api';
import { AICommandComposer } from '@/components/AICommandComposer';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import {
  Briefcase,
  Sparkles,
  FileText,
  Send,
  ArrowRight,
  User,
  Bookmark,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [jobsCount, setJobsCount] = useState<number>(0);
  const [resumesCount, setResumesCount] = useState<number>(0);
  const [appsCount, setAppsCount] = useState<number>(0);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [profData, jobsData, resumesData, appsData, recsData] = await Promise.allSettled([
          apiFetch('/profiles/me'),
          apiFetch('/jobs/'),
          apiFetch('/resumes/'),
          apiFetch('/applications/'),
          apiFetch('/jobs/recommendations?limit=4')
        ]);

        if (profData.status === 'fulfilled') {
          setProfile(profData.value);
        }
        if (jobsData.status === 'fulfilled' && Array.isArray(jobsData.value)) {
          setJobsCount(jobsData.value.length);
        }
        if (resumesData.status === 'fulfilled' && Array.isArray(resumesData.value)) {
          setResumesCount(resumesData.value.length);
        }
        if (appsData.status === 'fulfilled' && Array.isArray(appsData.value)) {
          setAppsCount(appsData.value.length);
          setRecentApps(appsData.value);
        }
        if (recsData.status === 'fulfilled' && recsData.value?.results) {
          setRecommendations(recsData.value.results);
        }
      } catch (err) {
        console.warn('Dashboard data fetch notice:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const name = profile?.personal?.name || 'Professional';
  const completeness = profile?.completeness_pct || 0;
  const verifiedFactsCount = (profile?.facts || []).filter((f: any) => f.verified).length;

  return (
    <AppShell>
      <div className="space-y-8">
        
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#1E3A8A]">{name}</span>.
            </h1>
            <p className="text-xs md:text-sm text-[#64748B] mt-1">
              Your real-time career intelligence workspace is active. What would you like to accomplish today?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/agent"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#003366] to-[#1E3A8A] hover:from-[#002244] hover:to-[#003366] text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Launch Career Counsellor AI</span>
            </Link>
          </div>
        </div>

        {/* Primary AI Command Composer */}
        <AICommandComposer />

        {/* Real-Time Database Snapshot Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
              Live Database Snapshot
            </h3>
            <span className="text-xs text-[#003366] font-semibold flex items-center gap-1 bg-[#E8EFF6] px-2.5 py-0.5 rounded-full border border-[#003366]/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#003366]" /> {verifiedFactsCount} Verified Facts in Profile
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/profile"
              className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#003366]/60 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#94A3B8]">Career Profile</span>
                <User className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#003366] transition-colors" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-[#0F172A]">{completeness}%</div>
                <div className="text-xs text-[#64748B]">Profile Completeness</div>
              </div>
            </Link>

            <Link
              href="/resume"
              className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#003366]/60 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#94A3B8]">Resume Studio</span>
                <FileText className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#003366] transition-colors" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-[#0F172A]">{resumesCount}</div>
                <div className="text-xs text-[#64748B]">Tailored Versions</div>
              </div>
            </Link>

            <Link
              href="/jobs"
              className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#003366]/60 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#94A3B8]">Discovered Jobs</span>
                <Bookmark className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#003366] transition-colors" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-[#0F172A]">{jobsCount}</div>
                <div className="text-xs text-[#64748B]">Market Opportunities</div>
              </div>
            </Link>

            <Link
              href="/applications"
              className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#003366]/60 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#94A3B8]">Applications</span>
                <Send className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#003366] transition-colors" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-[#0F172A]">{appsCount}</div>
                <div className="text-xs text-[#64748B]">Workspaces Active</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommended Jobs Based on CV Skills */}
        {recommendations.length > 0 && (
          <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[#E8EFF6] text-[#003366]">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Top Recommended Jobs (Matched to Your CV)</h3>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">Ranked by skill overlap and verified career profile alignment.</p>
              </div>
              <Link
                href="/jobs"
                className="text-xs text-[#003366] font-bold hover:underline flex items-center gap-1"
              >
                <span>View All Jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-[#E2E8F0] bg-gradient-to-b from-[#FFFFFF] to-[#F8FAFC] hover:border-[#003366]/60 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#0F172A] line-clamp-1">{rec.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8EFF6] text-[#003366] border border-[#003366]/20 shrink-0">
                        {rec.match_score}% Match
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-[#94A3B8]" /> {rec.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#94A3B8]" /> {rec.location}</span>
                    </div>
                  </div>

                  {rec.matched_skills && rec.matched_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rec.matched_skills.slice(0, 4).map((sk: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] font-medium">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-[#64748B] italic line-clamp-2">
                    {rec.recommendation}
                  </p>

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#94A3B8]">{rec.employment_type || 'Full-time'}</span>
                    <Link
                      href={`/jobs`}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#003366] to-[#1E3A8A] hover:from-[#002244] hover:to-[#003366] text-white font-semibold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>Apply with Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight Panel */}
        <AIInsightPanel />

        {/* Recent Applications Activity Table */}
        <div className="card-base p-5 bg-white border border-[#E4E4DF] rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4DF] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#181816]">Active Applications & Direct Dispatch</h3>
              <p className="text-xs text-[#6F6F68] mt-0.5">Live application records executed directly in code (No n8n).</p>
            </div>
            <Link
              href="/applications"
              className="text-xs text-[#181816] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApps.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E4E4DF] text-[#999990] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-2 px-3 font-semibold">Position</th>
                    <th className="py-2 px-3 font-semibold">Company</th>
                    <th className="py-2 px-3 font-semibold">Location</th>
                    <th className="py-2 px-3 font-semibold">Status</th>
                    <th className="py-2 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEFEA]">
                  {recentApps.map((app) => (
                    <tr key={app.id} className="hover:bg-[#F7F7F5] transition-colors group">
                      <td className="py-3 px-3 font-semibold text-[#181816]">
                        {app.job_title || 'Target Position'}
                      </td>
                      <td className="py-3 px-3 text-[#6F6F68]">
                        {app.company_name || 'Target Company'}
                      </td>
                      <td className="py-3 px-3 text-[#6F6F68] font-mono">
                        {app.location || 'Remote'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium badge-neutral">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href="/applications"
                          className="px-3 py-1 rounded bg-[#F1F1EE] hover:bg-[#E4E4DF] text-[#181816] font-medium text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Open Studio</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#6F6F68]">
              No active applications yet. Go to <Link href="/jobs" className="text-[#181816] font-semibold underline">Jobs</Link> to discover opportunities and prepare your first tailored application.
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
