'use client';

import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Plus, 
  Trash2, 
  Sparkles, 
  RefreshCw,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Sliders,
  CheckCircle2,
  X,
  Camera,
  Upload,
  Award,
  Link2
} from 'lucide-react';

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export interface ResumeFormData {
  title?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  photo_url?: string;
  summary?: string;
  experience?: Array<{
    role: string;
    company: string;
    location?: string;
    period: string;
    bullets: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    location?: string;
    year: string;
  }>;
  skills?: string[];
  certifications?: string[];
}

interface ResumeFormEditorProps {
  data: ResumeFormData;
  onChange: (newData: ResumeFormData) => void;
  onImportFromProfile?: () => void;
  isImporting?: boolean;
}

export function ResumeFormEditor({
  data,
  onChange,
  onImportFromProfile,
  isImporting = false
}: ResumeFormEditorProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications'>('personal');
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [targetRoleInput, setTargetRoleInput] = useState(data.title || '');
  const [isTailoring, setIsTailoring] = useState(false);

  const updateField = (field: keyof ResumeFormData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const updated = [
      ...(data.experience || []),
      {
        role: 'Software Engineer',
        company: 'Organization Name',
        period: '2023 — Present',
        bullets: ['Architected scalable microservices and APIs.']
      }
    ];
    updateField('experience', updated);
  };

  const handleUpdateExperience = (index: number, key: string, val: any) => {
    const updated = [...(data.experience || [])];
    updated[index] = { ...updated[index], [key]: val };
    updateField('experience', updated);
  };

  const handleRemoveExperience = (index: number) => {
    const updated = (data.experience || []).filter((_, i) => i !== index);
    updateField('experience', updated);
  };

  const handleAddBullet = (expIndex: number) => {
    const updated = [...(data.experience || [])];
    updated[expIndex].bullets = [...(updated[expIndex].bullets || []), 'Accomplished key project objectives.'];
    updateField('experience', updated);
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...(data.experience || [])];
    const bullets = [...(updated[expIndex].bullets || [])];
    bullets[bulletIndex] = text;
    updated[expIndex].bullets = bullets;
    updateField('experience', updated);
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...(data.experience || [])];
    updated[expIndex].bullets = (updated[expIndex].bullets || []).filter((_, i) => i !== bulletIndex);
    updateField('experience', updated);
  };

  // Education handlers
  const handleAddEducation = () => {
    const updated = [
      ...(data.education || []),
      {
        degree: 'B.S. Computer Science',
        institution: 'University Name',
        year: '2022'
      }
    ];
    updateField('education', updated);
  };

  const handleUpdateEducation = (index: number, key: string, val: string) => {
    const updated = [...(data.education || [])];
    updated[index] = { ...updated[index], [key]: val };
    updateField('education', updated);
  };

  const handleRemoveEducation = (index: number) => {
    const updated = (data.education || []).filter((_, i) => i !== index);
    updateField('education', updated);
  };

  // Skill handlers
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const current = data.skills || [];
    if (!current.includes(newSkill.trim())) {
      updateField('skills', [...current, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = (data.skills || []).filter(s => s !== skillToRemove);
    updateField('skills', updated);
  };

  // Certification handlers
  const handleAddCertification = () => {
    if (!newCertification.trim()) return;
    const current = data.certifications || [];
    if (!current.includes(newCertification.trim())) {
      updateField('certifications', [...current, newCertification.trim()]);
    }
    setNewCertification('');
  };

  const handleRemoveCertification = (certToRemove: string) => {
    const updated = (data.certifications || []).filter(c => c !== certToRemove);
    updateField('certifications', updated);
  };

  const handleAITailor = () => {
    if (!targetRoleInput.trim()) return;
    setIsTailoring(true);
    setTimeout(() => {
      updateField('title', targetRoleInput);
      if (data.summary && !data.summary.includes(targetRoleInput)) {
        updateField('summary', `Targeting ${targetRoleInput}. ` + data.summary);
      }
      setIsTailoring(false);
    }, 600);
  };

  return (
    <div className="space-y-5">
      
      {/* Editor Section Navigation Tabs */}
      <div className="flex p-1 bg-[#F1F1EE] rounded-xl border border-[#E4E4DF] gap-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'personal', label: 'Personal', icon: User },
          { id: 'summary', label: 'Summary', icon: FileText },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'skills', label: 'Skills', icon: Code },
          { id: 'certifications', label: 'Certifications', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2.5 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                active
                  ? 'bg-white text-[#181816] shadow-xs'
                  : 'text-[#6F6F68] hover:text-[#181816]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'personal' && (
        <div className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#181816] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#6F6F68]" /> Full Name
            </label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#181816] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#181816] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#6F6F68]" /> Professional Headline
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Senior Software & AI Engineer"
              className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#181816] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#181816] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#6F6F68]" /> Email Address
              </label>
              <input
                type="email"
                value={data.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="alex.chen@example.com"
                className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#181816] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#181816] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#6F6F68]" /> Phone Number
              </label>
              <input
                type="text"
                value={data.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#181816] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#181816] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#6F6F68]" /> Location / Country
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g. San Francisco, CA / Remote"
              className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#181816] transition-all"
            />
          </div>

          {/* Optional Social & Professional Profile Links */}
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
            <div className="text-[11px] font-mono uppercase font-bold text-[#6F6F68] flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#003366]" /> Professional Links & Social Profiles (Optional)
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#181816] flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-[#003366]" /> LinkedIn Profile
              </label>
              <input
                type="text"
                value={data.linkedin || ''}
                onChange={(e) => updateField('linkedin', e.target.value)}
                placeholder="e.g. linkedin.com/in/alexchen"
                className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#003366] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#181816] flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-[#181816]" /> GitHub Profile
                </label>
                <input
                  type="text"
                  value={data.github || ''}
                  onChange={(e) => updateField('github', e.target.value)}
                  placeholder="e.g. github.com/alexchen"
                  className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#003366] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#181816] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#003366]" /> Website / Portfolio
                </label>
                <input
                  type="text"
                  value={data.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="e.g. alexchen.dev"
                  className="w-full p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#003366] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Profile Picture Upload & Management */}
          <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0F172A] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#003366]" /> Profile Photo
              </label>
              {data.photo_url && (
                <button
                  type="button"
                  onClick={() => updateField('photo_url', '')}
                  className="text-[11px] text-[#B91C1C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove Photo
                </button>
              )}
            </div>

            {data.photo_url ? (
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center gap-3">
                <img
                  src={data.photo_url}
                  alt="Profile Preview"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-[#003366] shadow-xs shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-bold text-[#0F172A]">Photo Attached</div>
                  <p className="text-[10px] text-[#64748B]">Active on Europass and executive resume templates.</p>
                  <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003366] hover:underline cursor-pointer">
                    <Upload className="w-3 h-3" /> Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 4 * 1024 * 1024) {
                            alert('Image must be under 4MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            updateField('photo_url', ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="border-2 border-dashed border-[#CBD5E1] hover:border-[#003366] bg-[#F8FAFC] hover:bg-[#E8EFF6]/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all group">
                  <div className="p-2 rounded-full bg-white border border-[#E2E8F0] text-[#003366] group-hover:scale-110 transition-transform shadow-2xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">Click to upload photo</span>
                    <span className="text-[10px] text-[#64748B] font-mono">PNG, JPG, WEBP up to 4MB</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 4 * 1024 * 1024) {
                          alert('Image must be under 4MB');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          updateField('photo_url', ev.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Executive Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#181816] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#6F6F68]" /> Professional Summary
              </label>
              <span className="text-[10px] font-mono text-[#999990]">
                {data.summary?.length || 0} chars
              </span>
            </div>
            <textarea
              rows={6}
              value={data.summary || ''}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder="Provide a compelling overview of your technical background, impact, and engineering specialties..."
              className="w-full p-3 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#181816] leading-relaxed transition-all"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Work Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#181816]">{data.experience?.length || 0} Work Roles</span>
            <button
              type="button"
              onClick={handleAddExperience}
              className="px-2.5 py-1 rounded-lg bg-[#181816] hover:bg-[#2B2B28] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" /> Add Position
            </button>
          </div>

          <div className="space-y-3">
            {(data.experience || []).map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#E4E4DF] bg-[#F7F7F5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#181816] text-xs">Role #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="p-1 text-[#999990] hover:text-[#9E2A2B] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                    placeholder="Job Title"
                    className="p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                    placeholder="Company / Organization"
                    className="p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs"
                  />
                </div>

                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                  placeholder="2023 — Present"
                  className="w-full p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs"
                />

                {/* Bullets */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#6F6F68]">Impact & Achievements</span>
                    <button
                      type="button"
                      onClick={() => handleAddBullet(idx)}
                      className="text-[10px] text-[#181816] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>
                  {exp.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => handleUpdateBullet(idx, bIdx, e.target.value)}
                        placeholder="Bullet point achievement..."
                        className="flex-1 p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx, bIdx)}
                        className="p-1.5 text-[#999990] hover:text-[#9E2A2B]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Education */}
      {activeTab === 'education' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#181816]">{data.education?.length || 0} Academic Entries</span>
            <button
              type="button"
              onClick={handleAddEducation}
              className="px-2.5 py-1 rounded-lg bg-[#181816] hover:bg-[#2B2B28] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" /> Add Degree
            </button>
          </div>

          <div className="space-y-3">
            {(data.education || []).map((edu, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#E4E4DF] bg-[#F7F7F5] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#181816] text-xs">Degree #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="p-1 text-[#999990] hover:text-[#9E2A2B] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                  placeholder="Degree & Major (e.g. B.S. Computer Science)"
                  className="w-full p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                    placeholder="Institution / University"
                    className="p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                    placeholder="Year (e.g. 2021)"
                    className="p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#181816]">Add Technical Skill</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="e.g. PyTorch, Next.js, Kubernetes"
                className="flex-1 p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#181816]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 bg-[#181816] hover:bg-[#2B2B28] text-white font-semibold rounded-xl text-xs shadow-2xs"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-[#6F6F68] text-[11px]">Active Skills ({data.skills?.length || 0}):</span>
            <div className="flex flex-wrap gap-1.5">
              {(data.skills || []).map((sk, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F7F5] border border-[#E4E4DF] text-xs font-mono text-[#181816]"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="text-[#999990] hover:text-[#9E2A2B]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#181816]">Add Certification or License (Optional)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCertification()}
                placeholder="e.g. Google Analytics Certified, AWS Solutions Architect"
                className="flex-1 p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816] focus:outline-none focus:border-[#003366]"
              />
              <button
                type="button"
                onClick={handleAddCertification}
                className="px-4 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-xl text-xs shadow-2xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-[#6F6F68] text-[11px]">Active Certifications ({data.certifications?.length || 0}):</span>
            {(data.certifications && data.certifications.length > 0) ? (
              <div className="space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[#F7F7F5] border border-[#E4E4DF] rounded-xl text-xs text-[#181816]"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Award className="w-3.5 h-3.5 text-[#003366]" />
                      <span>{cert}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(cert)}
                      className="text-[#999990] hover:text-[#9E2A2B] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6F6F68] italic">No certifications added yet. (Optional)</p>
            )}
          </div>
        </div>
      )}

      {/* AI Role Tailor Banner */}
      <div className="p-3.5 bg-[#F7F7F5] rounded-xl border border-[#E4E4DF] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#181816] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#181816]" /> AI Role Tailoring & Job Discovery
          </span>
          <span className="text-[10px] font-mono text-[#6F6F68]">1-Click Alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={targetRoleInput}
            onChange={(e) => setTargetRoleInput(e.target.value)}
            placeholder="Target role (e.g. Lead AI Systems Architect)"
            className="flex-1 p-2 bg-white border border-[#E4E4DF] rounded-lg text-xs text-[#181816]"
          />
          <button
            type="button"
            onClick={handleAITailor}
            disabled={isTailoring}
            className="px-3 py-2 bg-[#181816] hover:bg-[#2B2B28] text-white rounded-lg text-xs font-semibold shrink-0 disabled:opacity-60 transition-colors shadow-xs"
          >
            {isTailoring ? 'Aligning...' : 'Tailor Resume'}
          </button>
        </div>
        {data.title && (
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="text-[#6F6F68]">Active CV Title: <strong className="text-[#181816]">{data.title}</strong></span>
            <a
              href={`/jobs?query=${encodeURIComponent(data.title)}&source=cv`}
              className="text-[#003366] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Search Jobs for this Role →</span>
            </a>
          </div>
        )}
      </div>

    </div>
  );
}
