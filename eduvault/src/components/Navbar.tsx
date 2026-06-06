import React, { useState } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Search, 
  Calculator, 
  ListTodo, 
  ArrowRightLeft, 
  Heart, 
  User, 
  Cpu,
  Bookmark,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ActivePage, UserSession } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activePage, 
  setActivePage, 
  session, 
  setSession 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditingScores, setIsEditingScores] = useState(false);
  const [tempGPA, setTempGPA] = useState(String(session.gpa));
  const [tempSAT, setTempSAT] = useState(String(session.sat));
  const [tempACT, setTempACT] = useState(String(session.act));
  const [tempMajor, setTempMajor] = useState(session.major);

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault();
    const gpaVal = Math.min(4.0, Math.max(0.0, parseFloat(tempGPA) || 0.0));
    const satVal = Math.min(1600, Math.max(400, parseInt(tempSAT) || 400));
    const actVal = Math.min(36, Math.max(1, parseInt(tempACT) || 1));
    
    setSession(prev => ({
      ...prev,
      gpa: Number(gpaVal.toFixed(2)),
      sat: satVal,
      act: actVal,
      major: tempMajor
    }));
    setIsEditingScores(false);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    setSession(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    setActivePage('home');
    setShowProfileMenu(false);
  };

  const savedCount = session.savedColleges.length + session.savedCourses.length;

  return (
    <header id="main-navbar" className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          id="nav-logo" 
          onClick={() => setActivePage('home')}
          className="flex cursor-pointer items-center space-x-2 transition hover:opacity-95"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-4 ring-slate-100">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
            Edu<span className="text-slate-500">Vault</span>
          </span>
        </div>

        {/* Primary Navigation */}
        <nav id="nav-menu" className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            id="nav-link-dashboard"
            onClick={() => setActivePage(session.isLoggedIn ? 'dashboard' : 'auth')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activePage === 'dashboard' 
                ? 'bg-slate-50 text-slate-900' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-link-explore"
            onClick={() => setActivePage('explore')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activePage === 'explore' || activePage === 'details'
                ? 'bg-slate-50 text-slate-900' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Explore Colleges</span>
          </button>

          <button
            id="nav-link-predictor"
            onClick={() => setActivePage('predictor')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activePage === 'predictor' || activePage === 'predictor-results' || activePage === 'predictor-history'
                ? 'bg-slate-50 text-slate-900' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>AI Predictor</span>
          </button>

          <button
            id="nav-link-tracker"
            onClick={() => setActivePage(session.isLoggedIn ? 'tracker' : 'auth')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activePage === 'tracker'
                ? 'bg-slate-50 text-slate-900' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ListTodo className="h-4 w-4" />
            <span>Applications Tracker</span>
          </button>

          <button
            id="nav-link-compare"
            onClick={() => setActivePage('compare')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activePage === 'compare'
                ? 'bg-slate-50 text-slate-900' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Compare</span>
          </button>

          <button
            id="nav-link-saved"
            onClick={() => setActivePage(session.isLoggedIn ? 'saved' : 'auth')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activePage === 'saved'
                ? 'bg-slate-50 text-slate-900' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Session Buttons */}
        <div id="nav-session-actions" className="flex items-center space-x-4">
          {session.isLoggedIn ? (
            <div className="relative">
              <button
                id="profile-dropdown-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 rounded-xl border border-slate-100 bg-slate-50/50 p-1.5 pr-3 text-left transition hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-sans text-xs font-semibold">
                  {session.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block">
                  <p className="font-sans text-xs font-semibold text-slate-950">{session.name}</p>
                  <p className="font-mono text-[9px] text-slate-500">GPA: {session.gpa} | SAT: {session.sat}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div id="nav-profile-menu" className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ring-1 ring-black/5 z-50">
                  <div className="border-b border-slate-100 pb-3 mb-3">
                    <p className="font-sans text-sm font-semibold text-slate-900">{session.name}</p>
                    <p className="font-sans text-xs text-slate-500 truncate">{session.email}</p>
                  </div>

                  {!isEditingScores ? (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-medium">Academic Profile</span>
                          <button 
                            onClick={() => {
                              setTempGPA(String(session.gpa));
                              setTempSAT(String(session.sat));
                              setTempACT(String(session.act));
                              setTempMajor(session.major);
                              setIsEditingScores(true);
                            }}
                            className="text-slate-900 font-semibold hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-slate-900">
                          <div>GPA: <span className="font-mono text-slate-600">{session.gpa}</span></div>
                          <div>SAT: <span className="font-mono text-slate-600">{session.sat}</span></div>
                          <div>ACT: <span className="font-mono text-slate-600">{session.act}</span></div>
                          <div className="col-span-2 truncate">Major: <span className="text-slate-600">{session.major}</span></div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setActivePage('dashboard');
                          setShowProfileMenu(false);
                        }}
                        className="flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        <span>Go to Student Dashboard</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <User className="h-4 w-4 text-rose-400" />
                        <span>Sign Out Session</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveScores} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">GPA (4.0 Scale)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          value={tempGPA}
                          onChange={(e) => setTempGPA(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SAT Score</label>
                          <input
                            type="number"
                            min="400"
                            max="1600"
                            value={tempSAT}
                            onChange={(e) => setTempSAT(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ACT Score</label>
                          <input
                            type="number"
                            min="1"
                            max="36"
                            value={tempACT}
                            onChange={(e) => setTempACT(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Intended Major</label>
                        <select
                          value={tempMajor}
                          onChange={(e) => setTempMajor(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none"
                        >
                          <option value="Computer Science">Computer Science</option>
                          <option value="Mechanical Engineering">Engineering</option>
                          <option value="Economics">Economics / Business</option>
                          <option value="Biology/Medicine">Biology & pre-Med</option>
                          <option value="Political Science">Political Science</option>
                          <option value="History">History & Humanities</option>
                        </select>
                      </div>
                      <div className="flex space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEditingScores(false)}
                          className="w-1/2 rounded-lg border border-slate-200 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 rounded-lg bg-slate-900 py-1 text-xs font-semibold text-white hover:bg-slate-850"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              id="nav-sign-in"
              onClick={() => setActivePage('auth')}
              className="group flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <span>Student Sign In</span>
              <Sparkles className="h-4 w-4 text-slate-350 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
