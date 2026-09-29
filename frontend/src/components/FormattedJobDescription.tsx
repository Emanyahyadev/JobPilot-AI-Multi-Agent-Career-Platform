'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  Award, 
  Globe, 
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

interface FormattedJobDescriptionProps {
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  preferredSkills?: string[];
  technologies?: string[];
  location?: string;
  country?: string;
  employmentType?: string;
  salary?: string;
  company?: string;
}

export function FormattedJobDescription({
  description = '',
  requirements = [],
  responsibilities = [],
  preferredSkills = [],
  technologies = [],
  location,
  country,
  employmentType,
  salary,
  company
}: FormattedJobDescriptionProps) {
  // Parse description text into structured sections if responsibilities/requirements arrays are empty
  const parsedSections = React.useMemo(() => {
    if (!description) return { overview: '', responsibilities: [], qualifications: [], benefits: [], companyInfo: '' };

    // Clean up ugly escaped characters
    const cleanText = description
      .replace(/[\u2022\u25ba\u25aa\u25cf]/g, ' - ')
      .replace(/\r/g, '')
      .replace(/THIS REQUIRES AN IN PERSON INTERVIEW[^\n]*/gi, '')
      .trim();

    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

    let currentSection: 'overview' | 'responsibilities' | 'qualifications' | 'benefits' | 'company' = 'overview';
    
    const overviewLines: string[] = [];
    const respLines: string[] = [];
    const qualLines: string[] = [];
    const benefitLines: string[] = [];
    const companyLines: string[] = [];

    for (const line of lines) {
      const lower = line.toLowerCase();
      
      if (lower.startsWith('responsibility') || lower.startsWith('responsibilities') || lower.includes('what you will do')) {
        currentSection = 'responsibilities';
        continue;
      } else if (lower.startsWith('qualification') || lower.startsWith('qualifications') || lower.startsWith('requirement') || lower.startsWith('requirements') || lower.includes('what we look for') || lower.includes('skills required')) {
        currentSection = 'qualifications';
        continue;
      } else if (lower.startsWith('benefit') || lower.startsWith('benefits') || lower.startsWith('perks') || lower.includes('what we offer')) {
        currentSection = 'benefits';
        continue;
      } else if (lower.startsWith('about ') || lower.includes('about the company')) {
        currentSection = 'company';
        continue;
      }

      // Add line to current section
      if (currentSection === 'overview') {
        overviewLines.push(line);
      } else if (currentSection === 'responsibilities') {
        respLines.push(line);
      } else if (currentSection === 'qualifications') {
        qualLines.push(line);
      } else if (currentSection === 'benefits') {
        benefitLines.push(line);
      } else if (currentSection === 'company') {
        companyLines.push(line);
      }
    }

    // Helper to format lines into clean bullet lists
    const formatBullets = (items: string[]) => {
      const bullets: string[] = [];
      for (const item of items) {
        // Split by bullet characters or inline headings
        const subItems = item.split(/[•▪►\-*]\s+/).map(s => s.trim()).filter(s => s.length > 2);
        if (subItems.length > 1) {
          bullets.push(...subItems);
        } else if (item.length > 0) {
          // Remove leading symbols
          const cleanItem = item.replace(/^[•▪►\-*—\s\d\.\)\s]+/, '').trim();
          if (cleanItem) bullets.push(cleanItem);
        }
      }
      return bullets;
    };

    return {
      overview: overviewLines.join(' '),
      responsibilities: respLines.length > 0 ? formatBullets(respLines) : responsibilities,
      qualifications: qualLines.length > 0 ? formatBullets(qualLines) : requirements,
      benefits: formatBullets(benefitLines),
      companyInfo: companyLines.join(' ')
    };
  }, [description, requirements, responsibilities]);

  // Combine passed props with parsed sections
  const finalResponsibilities = responsibilities.length > 0 ? responsibilities : parsedSections.responsibilities;
  const finalQualifications = requirements.length > 0 ? requirements : parsedSections.qualifications;

  return (
    <div className="space-y-6 text-xs text-[#181816]">

      {/* Role Snapshot Pills Header */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#F7F7F5] rounded-xl border border-[#E4E4DF]">
        {location && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#E4E4DF] text-xs font-medium text-[#181816]">
            <MapPin className="w-3.5 h-3.5 text-[#181816]" />
            <span>{location}</span>
          </span>
        )}
        {country && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF3FC] text-[#1E40AF] rounded-lg border border-[#BFDBFE] text-xs font-mono font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Country: {country}</span>
          </span>
        )}
        {employmentType && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-[#E4E4DF] text-xs font-medium text-[#6F6F68]">
            <Briefcase className="w-3.5 h-3.5 text-[#6F6F68]" />
            <span>{employmentType}</span>
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF5EE] text-[#2E6B47] rounded-lg border border-[#C3E2CD] text-xs font-mono font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{salary}</span>
          </span>
        )}
      </div>

      {/* Technologies & Stack Badges */}
      {technologies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#181816]">
            <Layers className="w-3.5 h-3.5 text-[#181816]" />
            <span>Required Tech Stack & Tools</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-white text-[#181816] border border-[#E4E4DF] shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Overview Section */}
      {(parsedSections.overview || description) && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#181816] border-b border-[#E4E4DF] pb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#181816]" />
            <span>Role Overview</span>
          </div>
          <p className="text-xs leading-relaxed text-[#444440] bg-white p-3.5 rounded-xl border border-[#E4E4DF]">
            {parsedSections.overview || description}
          </p>
        </div>
      )}

      {/* Core Responsibilities */}
      {finalResponsibilities.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#181816] border-b border-[#E4E4DF] pb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Key Responsibilities</span>
          </div>
          <ul className="space-y-2 bg-white p-4 rounded-xl border border-[#E4E4DF]">
            {finalResponsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#181816] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#181816] mt-1.5 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Qualifications & Requirements */}
      {finalQualifications.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#181816] border-b border-[#E4E4DF] pb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#181816]" />
            <span>Qualifications & Skills</span>
          </div>
          <ul className="space-y-2 bg-white p-4 rounded-xl border border-[#E4E4DF]">
            {finalQualifications.map((qual, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#181816] leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B47] shrink-0 mt-0.5" />
                <span>{qual}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preferred Skills */}
      {preferredSkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#181816] border-b border-[#E4E4DF] pb-1.5">
            <Award className="w-3.5 h-3.5 text-[#181816]" />
            <span>Preferred Skills & Experience</span>
          </div>
          <div className="flex flex-wrap gap-1.5 bg-white p-3.5 rounded-xl border border-[#E4E4DF]">
            {preferredSkills.map((ps, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-[#F7F7F5] border border-[#E4E4DF] text-[11px] font-medium text-[#181816]">
                + {ps}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits & Perks */}
      {parsedSections.benefits.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#181816] border-b border-[#E4E4DF] pb-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Compensation & Benefits</span>
          </div>
          <ul className="space-y-2 bg-[#EBF5EE]/50 p-4 rounded-xl border border-[#C3E2CD]">
            {parsedSections.benefits.map((ben, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#2E6B47]">
                <span>🎁</span>
                <span>{ben}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Company Overview */}
      {parsedSections.companyInfo && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#181816] border-b border-[#E4E4DF] pb-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#181816]" />
            <span>About {company || 'the Employer'}</span>
          </div>
          <p className="text-xs text-[#6F6F68] bg-white p-3.5 rounded-xl border border-[#E4E4DF] leading-relaxed">
            {parsedSections.companyInfo}
          </p>
        </div>
      )}

    </div>
  );
}
