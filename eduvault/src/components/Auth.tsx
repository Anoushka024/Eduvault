import React, { useState } from 'react';
import { ShieldAlert, Sparkles, User, Mail, Lock, CheckCircle, GraduationCap } from 'lucide-react';
import { UserSession } from '../types';

interface AuthProps {
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  setActivePage: (p: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ setSession, setActivePage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [gpa, setGPA] = useState('3.85');
  const [sat, setSAT] = useState('1450');
  const [act, setACT] = useState('32');
  const [major, setMajor] = useState('Computer Science');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({
      isLoggedIn: true,
      name: name || (isLogin ? 'Guest Student' : 'New User'),
      email: email || 'student@eduvault.edu',
      gpa: parseFloat(gpa) || 3.5,
      sat: parseInt(sat) || 1200,
      act: parseInt(act) || 26,
      major: major,
      savedColleges: ['harvard', 'berkeley', 'gatech'],
      savedCourses: ['Harvard University - Computer Science', 'University of California, Berkeley - Electrical Engineering & Computer Science (EECS)']
    });
    setActivePage('dashboard');
  };

  // Demo Profiles for quick testing
  const demoProfiles = [
    {
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      gpa: 3.96,
      sat: 1530,
      act: 35,
      major: 'Computer Science',
      badge: 'Ivy Cohort',
      savedColleges: ['harvard', 'mit', 'stanford'],
      savedCourses: []
    },
    {
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      gpa: 3.78,
      sat: 1440,
      act: 32,
      major: 'Mechanical Engineering',
      badge: 'Tech Cohort',
      savedColleges: ['gatech', 'umich', 'berkeley'],
      savedCourses: []
    },
    {
      name: 'Emma Rodriguez',
      email: 'emma.rod@example.com',
      gpa: 3.45,
      sat: 1220,
      act: 26,
      major: 'Business Administration',
      badge: 'State Cohort',
      savedColleges: ['asu', 'ucf', 'psu'],
      savedCourses: []
    }
  ];

  const handleDemoLogin = (p: typeof demoProfiles[0]) => {
    setSession({
      isLoggedIn: true,
      name: p.name,
      email: p.email,
      gpa: p.gpa,
      sat: p.sat,
      act: p.act,
      major: p.major,
      savedColleges: p.savedColleges,
      savedCourses: ['Boston University - Business Administration', 'University of California, Berkeley - EECS']
    });
    setActivePage('dashboard');
  };

  return (
    <div id="auth-container" className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row bg-slate-50/50">
      
      {/* Left Panel: Aesthetic intro */}
      <div className="flex flex-col justify-between bg-slate-900 px-6 py-12 md:px-12 md:w-1/2 text-white relative overflow-hidden">
        {/* Subtle decorative lights */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-slate-800 opacity-50 blur-[100px]" />
        <div className="absolute -bottom-40 -right-45 h-80 w-80 rounded-full bg-slate-800 opacity-60 blur-[100px]" />

        <div className="z-10">
          <div className="flex items-center space-x-2 text-white/90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950 font-bold shrink-0">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-sans text-md font-bold tracking-tight">EduVault</span>
          </div>
        </div>

        <div className="my-auto py-12 z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            Admissions Success System
          </span>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight md:text-4xl text-white leading-tight">
            Map your future with absolute data precision.
          </h1>
          <p className="font-sans text-sm text-slate-300 max-w-md leading-relaxed">
            Register your GPA and standardized scores. Access direct chances analysis, log essays, manage interview timelines, and monitor decisions in real time.
          </p>

          {/* Testimonial hook */}
          <div className="border-t border-slate-800 pt-6 mt-6 max-w-sm">
            <blockquote className="text-xs italic text-slate-400">
              "EduVault tracked my essays for 7 universities, and predicted my target entries with perfect reliability. Now a freshman at MIT!"
            </blockquote>
            <p className="text-[11px] font-bold text-slate-300 mt-2">— Jeremy K., Class of '29</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 z-10">
          Secure Sandboxed session. Created with elite frontend components.
        </div>
      </div>

      {/* Right Panel: Active dynamic form */}
      <div className="flex flex-col justify-center px-6 py-12 md:p-12 md:w-1/2 bg-white">
        <div className="mx-auto w-full max-w-md">
          
          <div className="mb-6">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Sign in to EduVault' : 'Create student account'}
            </h2>
            <p className="font-sans text-sm text-slate-500 mt-1">
              Select an instant profile or create a custom simulation role.
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div className="mb-6 rounded-2xl border border-dashed border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Instant Test Profiles</span>
              <span className="text-[10px] font-semibold text-slate-500">1-Click Sign In</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {demoProfiles.map((p) => (
                <button
                  type="button"
                  key={p.email}
                  onClick={() => handleDemoLogin(p)}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-slate-400 hover:shadow-xs active:bg-slate-50"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>{p.name}</span>
                      <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{p.badge}</span>
                    </p>
                    <p className="font-mono text-[10px] text-slate-500">
                      GPA: {p.gpa} | SAT: {p.sat} | Major: {p.major}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold text-slate-400">Or use custom email</span>
            </div>
          </div>

          {/* Core Custom Profile Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Student Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Liam Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="student@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Passcode</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* If not logged in & toggling register options, show score settings */}
            {!isLogin && (
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                  Register Simulation Metric Targets
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">GPA (4.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={gpa}
                      onChange={(e) => setGPA(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">SAT (400-1600)</label>
                    <input
                      type="number"
                      min="400"
                      max="1600"
                      value={sat}
                      onChange={(e) => setSAT(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">ACT (1-36)</label>
                    <input
                      type="number"
                      min="1"
                      max="36"
                      value={act}
                      onChange={(e) => setACT(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Concentration Area</label>
                  <select
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:border-slate-500 focus:outline-none bg-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Economics">Economics</option>
                    <option value="Biology/Medicine">Biology / Pre-Med</option>
                    <option value="Political Science">Political Science</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-[0.99]"
            >
              {isLogin ? 'Sign In Workspace' : 'Initialize Account Profile'}
            </button>
          </form>

          {/* Toggle isLogin footer link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition underline"
            >
              {isLogin ? "No account? Build a custom profile instead" : "Existing academic? Login credential check"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
