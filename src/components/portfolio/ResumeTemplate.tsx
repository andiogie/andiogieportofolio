"use client";

import React from 'react';

interface ResumeTemplateProps {
  data: any;
}

export function ResumeTemplate({ data }: ResumeTemplateProps) {
  return (
    <div id="resume-template" className="hidden print:block bg-white text-black p-10 font-serif leading-normal max-w-[850px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-6">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">{data.name}</h1>
        <p className="text-lg font-medium mb-4 text-gray-800">{data.title}</p>
        <div className="text-[11px] flex justify-center flex-wrap gap-x-4 gap-y-1 text-gray-700">
          <span className="font-bold">{data.email}</span>
          <span>|</span>
          <span className="font-bold">{data.phone}</span>
          <span>|</span>
          <span>{data.location}</span>
          {data.socials?.linkedin && (
            <>
              <span>|</span>
              <span className="font-bold">LinkedIn: {data.socials.linkedin.split('/').pop()}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-base font-bold border-b border-black pb-1 mb-2 uppercase tracking-wide">Professional Summary</h2>
        <p className="text-[13px] text-justify leading-relaxed">
          {data.bio}
        </p>
      </div>

      {/* Technical Skills - Integrated with Admin Panel */}
      <div className="mb-6">
        <h2 className="text-base font-bold border-b border-black pb-1 mb-2 uppercase tracking-wide">Technical Expertise</h2>
        <div className="grid grid-cols-1 gap-1">
          {data.skills?.map((cat: any, i: number) => (
            <div key={i} className="flex text-[12px]">
              <span className="font-bold w-[180px] shrink-0">• {cat.title}</span>
              <span className="flex-1">: {cat.items.map((s: any) => s.name).join(', ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold border-b border-black pb-1 mb-2 uppercase tracking-wide">Education</h2>
          <div className="space-y-2">
            {data.education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-[13px]">
                  <span>{edu.institution}</span>
                  <span>{edu.duration}</span>
                </div>
                <div className="flex justify-between text-[13px] italic">
                  <span>{edu.degree}</span>
                  <span>{edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-base font-bold border-b border-black pb-1 mb-2 uppercase tracking-wide">Work Experience</h2>
        <div className="space-y-4">
          {data.experiences?.map((exp: any, i: number) => (
            <div key={i}>
              <div className="flex justify-between font-bold text-[13px]">
                <span>{exp.company}</span>
                <span>{exp.duration}</span>
              </div>
              <p className="text-[13px] italic font-medium text-gray-800">{exp.role}</p>
              <p className="text-[12px] text-gray-700 mt-1 leading-relaxed text-justify">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Portfolio - ONLY TITLES for CV */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold border-b border-black pb-1 mb-2 uppercase tracking-wide">Project Portfolio</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {data.projects.map((proj: any, i: number) => (
              <div key={i} className="text-[12px] flex items-start gap-2">
                <span className="font-bold text-gray-400 mt-0.5">•</span>
                <span className="font-medium text-gray-900">{proj.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold border-b border-black pb-1 mb-2 uppercase tracking-wide">Certifications</h2>
          <ul className="text-[12px] space-y-1 list-none grid grid-cols-1">
            {data.certifications.map((cert: any, i: number) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold text-gray-400">•</span>
                <span><span className="font-bold">{cert.name}</span> — {cert.issuer} ({cert.year})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
