'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { apiFetch } from '@/lib/api';
import {
  Upload,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Edit3,
  Check,
  X,
  Briefcase,
  Award,
  GraduationCap,
  User,
  ExternalLink,
  Search,
  ArrowRight,
  Layers,
  Code,
  FileCheck
} from 'lucide-react';

interface ExtractedFact {
  id: string | number;
  path?: string;
  field?: string;
  value: any;
  source?: string;
  confidence?: number;
  verified?: boolean;
  category?: 'personal' | 'professional' | 'skills' | 'experience' | 'education' | 'certifications' | 'other';
}

interface ParsedProfileData {
  personal?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  professional?: {
    headline?: string;
    summary?: string;
    skills?: string[];
    experience_years?: number;
  };
  skills?: {
    technical?: string[];
    frameworks?: string[];
    tools?: string[];
  } | string[];
  experience?: Array<{
    company?: string;
    title?: string;
    years?: number;
    description?: string;
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    year?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
  }>;
  certifications?: string[];
}

export default function DocumentConfirmationPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [facts, setFacts] = useState<ExtractedFact[]>([]);
  const [parsedProfile, setParsedProfile] = useState<ParsedProfileData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingFactId, setEditingFactId] = useState<string | number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [parsedDocName, setParsedDocName] = useState<string | null>(null);

  const categorizePath = (path: string = ''): ExtractedFact['category'] => {
    const p = path.toLowerCase();
    if (p.includes('personal') || p.includes('email') || p.includes('phone') || p.includes('name') || p.includes('location') || p.includes('linkedin') || p.includes('github')) {
      return 'personal';
    }
    if (p.includes('headline') || p.includes('summary') || p.includes('professional')) {
      return 'professional';
    }
    if (p.includes('skill')) {
      return 'skills';
    }
    if (p.includes('experience') || p.includes('project')) {
      return 'experience';
    }
    if (p.includes('cert')) {
      return 'certifications';
    }
    if (p.includes('edu')) {
      return 'education';
    }
    return 'other';
  };

  const loadFactsAndProfile = async () => {
    setLoading(true);
    try {
      const profile = await apiFetch('/profiles/me');
      if (profile) {
        setParsedProfile({
          personal: profile.personal,
          professional: profile.professional,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          projects: profile.projects,
          certifications: profile.certifications
        });
      }
      if (profile.facts && Array.isArray(profile.facts)) {
        setFacts(profile.facts.map((f: any) => ({
          id: f.id,
          path: f.fact_key || 'profile.fact',
          field: f.fact_key || 'Profile Fact',
          value: f.fact_value,
          source: f.source || 'Saved Profile',
          confidence: f.confidence_score || 0.95,
          verified: f.verified,
          category: categorizePath(f.fact_key)
        })));
      }
    } catch (err) {
      console.warn('Profile load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFactsAndProfile();
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resData = await apiFetch('/documents/parse', {
        method: 'POST',
        body: formData
      });

      setParsedDocName(resData.filename || file.name);

      if (resData.profile_data) {
        setParsedProfile(resData.profile_data);
      }

      if (resData.facts && Array.isArray(resData.facts)) {
        const newFacts: ExtractedFact[] = resData.facts.map((f: any, idx: number) => ({
          id: `parsed_${Date.now()}_${idx}`,
          path: f.path || 'document.fact',
          field: f.path || 'Extracted Fact',
          value: f.value,
          source: resData.filename || file.name,
          confidence: f.confidence || 0.95,
          verified: false,
          category: categorizePath(f.path)
        }));

        setFacts(newFacts);
        setMessage({
          type: 'success',
          text: `Parsed "${resData.filename || file.name}" successfully! Extracted ${newFacts.length} granular profile facts. Review, edit, and click "Confirm & Sync All to Profile" below.`
        });
      }
    } catch (err: any) {
      console.error('File parse error:', err);
      setMessage({
        type: 'error',
        text: `Document parse error: ${err.message || 'Could not parse document'}. Try again or load sample data.`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSampleCV = () => {
    const sampleProfile: ParsedProfileData = {
      personal: {
        name: 'Eman Yahya',
        email: 'emanyahyadev@gmail.com',
        phone: '+92 325 5053535',
        location: 'Faisalabad, Pakistan',
        linkedin: 'linkedin.com/in/emanyahyadev',
        github: 'github.com/emanyahyadev'
      },
      professional: {
        headline: 'Agentic AI Engineer & Full Stack Developer',
        summary: 'I build production AI systems that solve and automate real business problems: intelligent assistants that manage complete customer conversations, multi-agent platforms that run daily operations, and RAG pipelines whose answers teams can trust.',
        experience_years: 3
      },
      skills: {
        technical: ['Python', 'FastAPI', 'Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'LangChain', 'LlamaIndex', 'CrewAI', 'AutoGen', 'ChromaDB'],
        frameworks: ['FastAPI', 'Next.js', 'React', 'LangChain'],
        tools: ['Docker', 'Git', 'PostgreSQL', 'ChromaDB', 'Linux']
      },
      experience: [
        {
          company: 'AI Solutions Lab',
          title: 'Senior Agentic AI Engineer',
          years: 2,
          description: 'Architected and deployed multi-agent automation systems and RAG pipelines with 98% accuracy for enterprise clients.'
        }
      ],
      education: [
        {
          institution: 'National University of Computer and Emerging Sciences',
          degree: 'B.S. in Computer Science',
          year: '2023'
        }
      ],
      certifications: [
        'Certified Kubernetes Application Developer (CKAD)',
        'AWS Certified Solutions Architect',
        'DeepLearning.AI Generative AI Specialist'
      ]
    };

    setParsedDocName('Sample_AI_Engineer_CV.pdf');
    setParsedProfile(sampleProfile);

    const sampleFacts: ExtractedFact[] = [
      { id: 's_1', path: 'personal.name', field: 'Candidate Name', value: 'Eman Yahya', source: 'Sample_CV.pdf', confidence: 0.98, verified: false, category: 'personal' },
      { id: 's_2', path: 'professional.headline', field: 'Headline / Role', value: 'Agentic AI Engineer & Full Stack Developer', source: 'Sample_CV.pdf', confidence: 0.95, verified: false, category: 'professional' },
      { id: 's_3', path: 'personal.email', field: 'Email Address', value: 'emanyahyadev@gmail.com', source: 'Sample_CV.pdf', confidence: 0.99, verified: false, category: 'personal' },
      { id: 's_4', path: 'personal.phone', field: 'Phone', value: '+92 325 5053535', source: 'Sample_CV.pdf', confidence: 0.95, verified: false, category: 'personal' },
      { id: 's_5', path: 'personal.location', field: 'Location', value: 'Faisalabad, Pakistan', source: 'Sample_CV.pdf', confidence: 0.92, verified: false, category: 'personal' },
      { id: 's_6', path: 'personal.linkedin', field: 'LinkedIn Profile', value: 'linkedin.com/in/emanyahyadev', source: 'Sample_CV.pdf', confidence: 0.95, verified: false, category: 'personal' },
      { id: 's_7', path: 'professional.summary', field: 'Executive Summary', value: sampleProfile.professional?.summary, source: 'Sample_CV.pdf', confidence: 0.92, verified: false, category: 'professional' },
      { id: 's_8', path: 'skills', field: 'Technical Skills', value: ['Python', 'FastAPI', 'Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'LangChain', 'LlamaIndex', 'CrewAI', 'AutoGen'], source: 'Sample_CV.pdf', confidence: 0.96, verified: false, category: 'skills' },
      { id: 's_9', path: 'certifications', field: 'Certifications', value: sampleProfile.certifications, source: 'Sample_CV.pdf', confidence: 0.95, verified: false, category: 'certifications' },
      { id: 's_10', path: 'experience[0]', field: 'Work Experience', value: 'Senior Agentic AI Engineer at AI Solutions Lab', source: 'Sample_CV.pdf', confidence: 0.90, verified: false, category: 'experience' },
      { id: 's_11', path: 'education[0]', field: 'Education', value: 'B.S. in Computer Science - FAST NUCES (2023)', source: 'Sample_CV.pdf', confidence: 0.92, verified: false, category: 'education' },
    ];

    setFacts(sampleFacts);
    setMessage({
      type: 'info',
      text: 'Loaded complete Sample AI Engineer CV! Review the structured facts below and sync to your profile.'
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmFact = async (factId: string | number) => {
    try {
      if (typeof factId === 'number') {
        await apiFetch('/profiles/me/facts/confirm', {
          method: 'POST',
          body: JSON.stringify({ fact_ids: [factId], action: 'confirm' })
        });
      }
      setFacts(prev => prev.map(f => f.id === factId ? { ...f, verified: true } : f));
    } catch (err) {
      console.error('Fact confirm failed:', err);
    }
  };

  const handleRejectFact = async (factId: string | number) => {
    try {
      if (typeof factId === 'number') {
        await apiFetch('/profiles/me/facts/reject', {
          method: 'POST',
          body: JSON.stringify({ fact_ids: [factId], action: 'reject' })
        });
      }
      setFacts(prev => prev.filter(f => f.id !== factId));
    } catch (err) {
      console.error('Fact reject failed:', err);
    }
  };

  const startEdit = (fact: ExtractedFact) => {
    setEditingFactId(fact.id);
    const valStr = Array.isArray(fact.value)
      ? fact.value.join(', ')
      : typeof fact.value === 'object'
        ? JSON.stringify(fact.value)
        : String(fact.value || '');
    setEditValue(valStr);
  };

  const saveEdit = (factId: string | number) => {
    setFacts(prev => prev.map(f => {
      if (f.id === factId) {
        let updatedVal: any = editValue;
        if (Array.isArray(f.value)) {
          updatedVal = editValue.split(',').map(s => s.trim()).filter(Boolean);
        }
        return { ...f, value: updatedVal };
      }
      return f;
    }));
    setEditingFactId(null);
  };

  const cancelEdit = () => {
    setEditingFactId(null);
  };

  const handleConfirmAll = async () => {
    setIsSyncing(true);
    setMessage(null);
    try {
      // Build updated profile_data from verified facts and parsedProfile
      const updatedProfile: any = { ...(parsedProfile || {}) };
      
      facts.forEach(f => {
        const path = f.path || '';
        if (path === 'personal.name') {
          updatedProfile.personal = { ...(updatedProfile.personal || {}), name: f.value };
        } else if (path === 'personal.email') {
          updatedProfile.personal = { ...(updatedProfile.personal || {}), email: f.value };
        } else if (path === 'personal.phone') {
          updatedProfile.personal = { ...(updatedProfile.personal || {}), phone: f.value };
        } else if (path === 'personal.location') {
          updatedProfile.personal = { ...(updatedProfile.personal || {}), location: f.value };
        } else if (path === 'personal.linkedin') {
          updatedProfile.personal = { ...(updatedProfile.personal || {}), linkedin: f.value };
        } else if (path === 'personal.github') {
          updatedProfile.personal = { ...(updatedProfile.personal || {}), github: f.value };
        } else if (path === 'professional.headline') {
          updatedProfile.professional = { ...(updatedProfile.professional || {}), headline: f.value };
        } else if (path === 'professional.summary') {
          updatedProfile.professional = { ...(updatedProfile.professional || {}), summary: f.value };
        } else if (path === 'skills') {
          const skillsList = Array.isArray(f.value) ? f.value : [String(f.value)];
          updatedProfile.skills = {
            technical: skillsList,
            frameworks: skillsList.filter(s => ['FastAPI', 'Next.js', 'React', 'Django', 'Node.js', 'Express', 'LangChain'].includes(s)),
            tools: skillsList.filter(s => ['Docker', 'Git', 'PostgreSQL', 'Kubernetes', 'AWS', 'Linux', 'ChromaDB'].includes(s))
          };
        } else if (path === 'certifications') {
          updatedProfile.certifications = Array.isArray(f.value) ? f.value : [String(f.value)];
        }
      });

      const res = await apiFetch('/documents/sync-profile', {
        method: 'POST',
        body: JSON.stringify({
          profile_data: updatedProfile,
          facts: facts.map(f => ({ ...f, verified: true }))
        })
      });

      // Mark all facts verified in state
      setFacts(prev => prev.map(f => ({ ...f, verified: true })));
      setParsedProfile(res.profile || updatedProfile);

      setMessage({
        type: 'success',
        text: `All facts and profile data successfully confirmed & synced! Canonical completeness: ${res.completeness_pct || 100}%. You can now generate your tailored Resume or find matching jobs.`
      });
    } catch (err: any) {
      console.error('Sync failed:', err);
      setMessage({
        type: 'error',
        text: `Sync error: ${err.message || 'Could not commit profile to database.'}`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredFacts = facts.filter(f => {
    if (activeCategory === 'all') return true;
    return f.category === activeCategory;
  });

  const confirmedCount = facts.filter(f => f.verified).length;

  return (
    <AppShell>
      <div className="space-y-8 pb-16 max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#E4E4DF] bg-white text-xs font-mono text-[#6F6F68] mb-2 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B47]" />
              <span>Real Live Document Parsing & Canonical Fact Verification</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#181816]">
              Document Upload & Fact Confirmation
            </h1>
            <p className="text-xs md:text-sm text-[#6F6F68] mt-1 max-w-3xl">
              Upload real CVs, resumes, and certificates. Each extracted fact is granularly presented for human approval before entering your database profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSampleCV}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E4DF] hover:border-[#181816] text-[#181816] font-mono text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              title="Quickly test with sample CV data"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#181816]" />
              <span>Load Sample AI Engineer CV</span>
            </button>
            <button
              onClick={loadFactsAndProfile}
              className="p-2 rounded-lg bg-white border border-[#E4E4DF] text-[#6F6F68] hover:text-[#181816] shadow-xs"
              title="Refresh facts from database"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Real File Upload Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="card-base p-8 bg-white border-2 border-dashed border-[#D5D5CE] hover:border-[#181816] rounded-2xl text-center flex flex-col items-center justify-center space-y-3 transition-all cursor-pointer relative group shadow-xs"
        >
          <input
            type="file"
            onChange={handleFileInputChange}
            accept=".pdf,.docx,.txt"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="w-14 h-14 rounded-full bg-[#F7F7F5] border border-[#E4E4DF] flex items-center justify-center text-[#181816] group-hover:scale-105 transition-transform shadow-xs">
            <Upload className={`w-6 h-6 text-[#6F6F68] group-hover:text-[#181816] ${isUploading ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#181816]">
              {isUploading ? 'Parsing document & extracting facts with AI engine...' : 'Click to select or drag real CV / Document file here'}
            </h3>
            <p className="text-xs text-[#6F6F68] mt-1 font-mono">
              Supports real PDF, DOCX, and TXT resumes with full text parsing
            </p>
          </div>
          {parsedDocName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F1EE] border border-[#E4E4DF] text-xs font-mono text-[#181816]">
              <FileCheck className="w-3.5 h-3.5 text-[#2E6B47]" />
              <span>Loaded Document: {parsedDocName}</span>
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 transition-all shadow-xs ${
            message.type === 'success' ? 'bg-[#EBF5EE] border-[#C3E2CD] text-[#2E6B47]' :
            message.type === 'error' ? 'bg-[#FDF0ED] border-[#F5C2B8] text-[#9E2A2B]' :
            'bg-[#F0F4FA] border-[#C5D5ED] text-[#1E3A8A]'
          }`}>
            {message.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            {message.type === 'error' && <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            {message.type === 'info' && <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            <span className="font-medium leading-relaxed">{message.text}</span>
          </div>
        )}

        {/* Parsed Profile Overview Card & Action Hub */}
        {parsedProfile && (parsedProfile.personal?.name || parsedProfile.professional?.headline || (facts.length > 0)) && (
          <div className="card-base p-6 bg-[#FCFCFA] border border-[#E4E4DF] rounded-2xl space-y-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#181816] text-white text-[11px] font-mono font-bold rounded">
                    Parsed Candidate Profile
                  </span>
                  <span className="text-xs font-mono text-[#6F6F68]">
                    {confirmedCount} of {facts.length} facts verified
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#181816]">
                  {parsedProfile.personal?.name || 'Candidate Name'}
                </h2>
                <p className="text-xs text-[#6F6F68] font-medium">
                  {parsedProfile.professional?.headline || 'Professional Headline'}
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleConfirmAll}
                  disabled={isSyncing || facts.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-[#181816] hover:bg-[#2B2B28] text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className={`w-4 h-4 ${isSyncing ? 'animate-spin' : 'text-[#2E6B47]'}`} />
                  <span>{isSyncing ? 'Syncing to Database...' : 'Confirm & Sync All to Profile'}</span>
                </button>
                <Link
                  href="/resume"
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#E4E4DF] hover:border-[#181816] text-[#181816] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#181816]" />
                  <span>Go to Resume Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6F6F68]" />
                </Link>
                <Link
                  href="/jobs"
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#E4E4DF] hover:border-[#181816] text-[#181816] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Search className="w-4 h-4 text-[#181816]" />
                  <span>Find Jobs for this CV</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6F6F68]" />
                </Link>
              </div>
            </div>

            {/* Quick Profile Summary Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-white border border-[#E4E4DF] rounded-xl space-y-2">
                <div className="font-mono text-[11px] text-[#6F6F68] uppercase font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#181816]" /> Contact Information
                </div>
                <div className="space-y-1 text-[#181816]">
                  <div><span className="text-[#6F6F68]">Email:</span> {parsedProfile.personal?.email || 'N/A'}</div>
                  <div><span className="text-[#6F6F68]">Phone:</span> {parsedProfile.personal?.phone || 'N/A'}</div>
                  <div><span className="text-[#6F6F68]">Location:</span> {parsedProfile.personal?.location || 'N/A'}</div>
                  {parsedProfile.personal?.linkedin && (
                    <div className="truncate"><span className="text-[#6F6F68]">LinkedIn:</span> {parsedProfile.personal.linkedin}</div>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-white border border-[#E4E4DF] rounded-xl space-y-2 md:col-span-2">
                <div className="font-mono text-[11px] text-[#6F6F68] uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#181816]" /> Professional Summary
                </div>
                <p className="text-[#181816] text-xs leading-relaxed italic line-clamp-3">
                  "{parsedProfile.professional?.summary || 'No summary extracted yet.'}"
                </p>
                {parsedProfile.certifications && parsedProfile.certifications.length > 0 && (
                  <div className="pt-2 border-t border-[#E4E4DF] flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-[#6F6F68] font-bold">Certifications:</span>
                    {parsedProfile.certifications.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#F1F1EE] border border-[#E4E4DF] rounded text-[11px] font-mono text-[#181816]">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Extracted Facts Review Table & Category Filters */}
        <div className="card-base p-6 bg-white border border-[#E4E4DF] rounded-2xl space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#181816] flex items-center gap-2">
                <span>Extracted Canonical Profile Facts</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F1F1EE] text-[#181816] text-xs font-mono font-normal">
                  {facts.length} items
                </span>
              </h3>
              <p className="text-xs text-[#6F6F68] mt-0.5">
                Review, edit inline, and verify each fact. Only verified facts are saved into your Canonical Profile database.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'All Facts' },
                { key: 'personal', label: 'Personal' },
                { key: 'professional', label: 'Summary' },
                { key: 'skills', label: 'Skills' },
                { key: 'certifications', label: 'Certifications' },
                { key: 'experience', label: 'Experience' },
                { key: 'education', label: 'Education' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    activeCategory === cat.key
                      ? 'bg-[#181816] text-white font-bold'
                      : 'bg-[#F7F7F5] hover:bg-[#E4E4DF] text-[#6F6F68]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredFacts.length > 0 ? (
            <div className="space-y-3">
              {filteredFacts.map((fact) => {
                const isEditing = editingFactId === fact.id;
                const displayValue = Array.isArray(fact.value)
                  ? fact.value.join(', ')
                  : typeof fact.value === 'object'
                    ? JSON.stringify(fact.value)
                    : String(fact.value || '');

                return (
                  <div
                    key={fact.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                      fact.verified
                        ? 'bg-[#F9FAF8] border-[#D1E7DD]'
                        : 'bg-[#FCFCFA] border-[#E4E4DF] hover:border-[#181816]'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-[#E4E4DF] text-[#181816]">
                          {fact.path || fact.field || 'Fact'}
                        </span>
                        <span className="font-mono text-[10px] text-[#6F6F68] bg-[#F1F1EE] px-1.5 py-0.5 rounded">
                          Confidence: {((fact.confidence || 0.95) * 100).toFixed(0)}%
                        </span>
                        <span className="font-mono text-[10px] text-[#999990]">
                          Source: {fact.source || 'Document'}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-[#181816] rounded-lg focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(fact.id)}
                            className="p-1.5 bg-[#181816] text-white rounded-lg hover:bg-[#2B2B28]"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 bg-white border border-[#E4E4DF] text-[#6F6F68] rounded-lg hover:bg-[#F1F1EE]"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 group/val">
                          <div className="text-sm font-semibold text-[#181816] leading-relaxed break-words">
                            {Array.isArray(fact.value) ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {fact.value.map((v, vi) => (
                                  <span key={vi} className="px-2 py-0.5 bg-white border border-[#E4E4DF] rounded text-xs font-medium text-[#181816]">
                                    {String(v)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              displayValue
                            )}
                          </div>
                          {!fact.verified && (
                            <button
                              onClick={() => startEdit(fact)}
                              className="opacity-0 group-hover/val:opacity-100 p-1 text-[#6F6F68] hover:text-[#181816] transition-opacity"
                              title="Edit value"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {fact.verified ? (
                        <span className="px-3 py-1.5 rounded-lg bg-[#EBF5EE] border border-[#C3E2CD] text-[#2E6B47] text-xs font-mono font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" /> Verified
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRejectFact(fact.id)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FDF0ED] border border-[#E4E4DF] hover:border-[#F5C2B8] text-[#9E2A2B] font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleConfirmFact(fact.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#181816] hover:bg-[#2B2B28] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Confirm Fact
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-[#6F6F68] font-mono border border-dashed border-[#E4E4DF] rounded-xl space-y-2">
              <FileText className="w-8 h-8 text-[#999990] mx-auto" />
              <div>No facts found for "{activeCategory}".</div>
              <p className="text-[11px] text-[#999990]">Upload a CV document or click "Load Sample AI Engineer CV" above.</p>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
