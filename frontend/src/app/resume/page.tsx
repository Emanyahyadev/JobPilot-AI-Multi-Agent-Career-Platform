'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { apiFetch } from '@/lib/api';
import { ResumePreview } from '@/components/ResumePreview';
import { ResumeFormEditor, ResumeFormData } from '@/components/ResumeFormEditor';
import {
  FileText,
  Sparkles,
  Download,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  RefreshCw,
  Edit3,
  Save,
  Globe,
  Award,
  Layers,
  LayoutTemplate,
  FileCheck,
  Briefcase,
  Code2
} from 'lucide-react';

interface ResumeVersionItem {
  id: number;
  title: string;
  template_type: string;
  target_role?: string;
  score?: number;
  created_at?: string;
  content_snapshot?: any;
}

const TEMPLATES = [
  { id: 'Europass Standard', label: 'EU Europass Official', icon: Globe },
  { id: 'ATS Clean', label: 'ATS Modern Clean', icon: FileCheck },
  { id: 'Modern Executive', label: 'Executive Leadership', icon: Briefcase },
  { id: 'Technical Specialist', label: 'Technical Specialist', icon: Code2 }
];

export default function ResumeStudioPage() {
  const [versions, setVersions] = useState<ResumeVersionItem[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersionItem | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Europass Standard');
  const [targetRole, setTargetRole] = useState<string>('Senior Software & AI Engineer');
  const [loading, setLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<'editor' | 'versions'>('editor');
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live CV Form State
  const [formData, setFormData] = useState<ResumeFormData>({
    title: 'Digital Marketing | SEO | SEM | Content Marketing',
    name: 'Michael Harris',
    email: 'michael.harris@email.com',
    phone: '+61 412 345 678',
    location: 'Sydney, Australia',
    linkedin: 'linkedin.com/in/michaelharris',
    github: '',
    website: '',
    summary: 'Results-oriented marketing professional with over 5 years of experience in digital marketing, brand strategy, and content creation. Proven ability to drive brand growth, increase online engagement, and deliver data-driven results. Expert in utilizing digital tools and analytics to optimize marketing campaigns and achieve business objectives.',
    experience: [
      {
        role: 'Marketing Manager',
        company: 'XYZ Corporation',
        location: 'Sydney, NSW',
        period: 'January 2022 – Present',
        bullets: [
          'Lead a team of 5 in creating and executing digital marketing strategies across multiple platforms, including social media, SEO, and email campaigns.',
          'Achieved a 35% increase in website traffic and 50% boost in social media engagement within the first year.',
          'Managed a marketing budget of $200,000, ensuring maximum ROI through cost-effective advertising strategies.'
        ]
      },
      {
        role: 'Digital Marketing Specialist',
        company: 'ABC Solutions',
        location: 'Melbourne, VIC',
        period: 'June 2018 – December 2021',
        bullets: [
          'Developed and executed SEO and SEM strategies that increased organic search traffic by 25%.',
          'Created and managed Google Ads and Facebook Ads campaigns, resulting in a 20% increase in qualified leads.',
          'Produced engaging content for blogs, newsletters, and social media platforms to attract target audiences.'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Marketing',
        institution: 'University of Sydney',
        location: 'Sydney, NSW',
        year: '2018'
      }
    ],
    skills: [
      'Digital Marketing Strategy, SEO & SEM, Google Analytics & SEMrush',
      'Social Media Marketing, Content Creation & Copywriting, Budget Management, Data Analysis'
    ],
    certifications: [
      'Google Analytics Certified',
      'Facebook Blueprint Certification',
      'HubSpot Inbound Marketing Certification'
    ]
  });

  const loadResumes = async () => {
    setLoading(true);
    setResumeError(null);
    try {
      const data = await apiFetch('/resumes/');
      if (Array.isArray(data) && data.length > 0) {
        setVersions(data);
        const withContent = data.find((r: any) => r.content_snapshot);
        if (withContent && withContent.content_snapshot) {
          setSelectedVersion(withContent);
          setFormData(prev => ({
            ...prev,
            ...withContent.content_snapshot
          }));
        } else {
          setSelectedVersion(data[0]);
        }
      }
    } catch (err: any) {
      console.warn('Resume load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleImportFromProfile = async () => {
    setIsImporting(true);
    try {
      const profile = await apiFetch('/profiles/me');
      if (profile) {
        const profObj = profile.professional || {};
        const persObj = profile.personal || {};
        const expList = Array.isArray(profile.experience) && profile.experience.length > 0
          ? profile.experience.map((e: any) => ({
              role: e.title || e.role || 'Software Engineer',
              company: e.company || 'Organization',
              location: e.location || '',
              period: `${e.start_date || '2022'} — ${e.end_date || 'Present'}`,
              bullets: Array.isArray(e.highlights) ? e.highlights : Array.isArray(e.bullets) ? e.bullets : [e.description || 'Delivered core system improvements.']
            }))
          : formData.experience;

        const eduList = Array.isArray(profile.education) && profile.education.length > 0
          ? profile.education.map((ed: any) => ({
              degree: ed.degree || ed.field || 'B.S. Computer Science',
              institution: ed.institution || ed.school || 'University',
              location: ed.location || '',
              year: String(ed.year || ed.end_year || '2021')
            }))
          : formData.education;

        let skillList = formData.skills;
        if (profile.skills) {
          if (Array.isArray(profile.skills)) {
            skillList = profile.skills;
          } else if (typeof profile.skills === 'object') {
            const flattened: string[] = [];
            Object.values(profile.skills).forEach((v: any) => {
              if (Array.isArray(v)) flattened.push(...v);
              else if (typeof v === 'string') flattened.push(v);
            });
            if (flattened.length > 0) skillList = flattened;
          }
        }

        const certList = Array.isArray(profile.certifications)
          ? profile.certifications.map((c: any) => typeof c === 'string' ? c : c.name || c.title || String(c))
          : formData.certifications || [];

        setFormData({
          title: profObj.headline || profObj.title || formData.title,
          name: persObj.name || formData.name,
          email: persObj.email || formData.email,
          phone: persObj.phone || formData.phone,
          location: persObj.location || formData.location,
          linkedin: persObj.linkedin || persObj.linkedin_url || formData.linkedin || '',
          github: persObj.github || persObj.github_url || formData.github || '',
          website: persObj.website || persObj.portfolio_url || formData.website || '',
          summary: profObj.summary || formData.summary,
          experience: expList,
          education: eduList,
          skills: skillList,
          certifications: certList
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err: any) {
      console.warn('Profile import error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveCustomResume = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const savedRes = await apiFetch('/resumes/', {
        method: 'POST',
        body: JSON.stringify({
          title: `${formData.title || 'Resume'} (${new Date().toLocaleDateString()})`,
          template: selectedTemplate,
          target_role: targetRole
        })
      });

      if (savedRes && savedRes.id) {
        await apiFetch(`/resumes/${savedRes.id}/generate`, {
          method: 'POST',
          body: JSON.stringify({
            target_role: targetRole,
            template: selectedTemplate,
            custom_content: formData
          })
        });
      }

      await loadResumes();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Save resume error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Sleek, Executive Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4 print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#0EA5E9] shadow-[0_0_6px_#0EA5E9]" />
                <span className="text-[11px] font-mono text-[#0284C7] uppercase tracking-wider font-bold">
                  JobPilot Document Studio
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Resume Studio
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Design ATS-compliant and Europass resumes with real-time live preview and AI role tailoring.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`/jobs?query=${encodeURIComponent(formData.title || targetRole)}&source=cv`}
                className="px-3.5 py-2 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#003366] border border-[#BAE6FD] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Find Matching Jobs</span>
              </a>

              <button
                onClick={handleImportFromProfile}
                disabled={isImporting}
                className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:border-[#003366]/50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#003366] ${isImporting ? 'animate-spin' : ''}`} />
                <span>{isImporting ? 'Syncing...' : 'Sync from Profile'}</span>
              </button>

              <button
                onClick={handleSaveCustomResume}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#003366] to-[#1E3A8A] hover:from-[#002244] hover:to-[#003366] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Cloud!' : 'Save Version'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Action Banner on Save / Alignment */}
          {saveSuccess && (
            <div className="p-3.5 bg-gradient-to-r from-[#F0FDF4] to-[#EFF6FF] border border-[#86EFAC] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5 text-xs text-[#15803D]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <div>
                  <span className="font-bold">Resume Synchronized!</span>
                  <span className="text-[#334155] ml-1">Ready to search live jobs matching <strong className="text-[#0F172A]">{formData.title || targetRole}</strong>?</span>
                </div>
              </div>
              <a
                href={`/jobs?query=${encodeURIComponent(formData.title || targetRole)}&source=cv`}
                className="px-3.5 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Search Relevant Jobs</span>
              </a>
            </div>
          )}

          {/* Template Format Selector Strip */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#64748B] font-bold">
              <LayoutTemplate className="w-3.5 h-3.5 text-[#003366]" />
              <span>Select Design Template:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
              {TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                const active = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-white text-[#003366] shadow-xs border border-[#003366]/30'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#003366]' : 'text-[#94A3B8]'}`} />
                    <span>{tmpl.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-Column Studio Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start print:block print:w-full">
          
          {/* Left Panel: Form & AI Tailor */}
          <div className="xl:col-span-5 space-y-4 print:hidden">
            <div className="bg-white border border-[#E4E4DF] rounded-2xl p-5 shadow-xs">
              <ResumeFormEditor
                data={formData}
                onChange={setFormData}
                onImportFromProfile={handleImportFromProfile}
                isImporting={isImporting}
              />
            </div>
          </div>

          {/* Right Panel: Live Document Canvas */}
          <div className="xl:col-span-7 sticky top-20 print:static print:w-full print:m-0 print:p-0">
            <ResumePreview
              resume={formData}
              templateName={selectedTemplate}
            />
          </div>

        </div>

      </div>
    </AppShell>
  );
}
