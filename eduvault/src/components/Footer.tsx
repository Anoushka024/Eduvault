import React from 'react';
import { GraduationCap, Github, Twitter, Shield, FileText } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer id="global-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Logo & Vision */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight">EduVault</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              An intelligent, unified platform simplifying university searches, data-driven admissions predictions, and deadline tracking for ambitious students.
            </p>
          </div>

          {/* Quick Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Active Modules</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <button onClick={() => setActivePage('explore')} className="hover:text-white transition">
                  University Explorer
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('predictor')} className="hover:text-white transition">
                  Admission Chance Predictor
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('compare')} className="hover:text-white transition">
                  Side-by-Side Comparison
                </button>
              </li>
            </ul>
          </div>

          {/* Student Area */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Student Portal</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-white transition">
                  My Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tracker')} className="hover:text-white transition">
                  Applications Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('saved')} className="hover:text-white transition">
                  Saved Universities & Programs
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Security & Data</h4>
            <div className="space-y-2 text-[11px] leading-relaxed text-slate-400 font-sans">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-slate-400" />
                <span>Local Session Cache</span>
              </div>
              <p>
                Student GPA, test scores, and saved lists are securely stored in your local sandbox browser session. All probability calculations are simulated algorithmically on-device.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-slate-500">
          <p>© 2026 EduVault Inc. All rights reserved. Built for elite academic planning.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-300 transition"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-slate-300 transition"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-slate-300 transition flex items-center space-x-1">
              <FileText className="h-3.5 w-3.5" />
              <span>User Terms</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
