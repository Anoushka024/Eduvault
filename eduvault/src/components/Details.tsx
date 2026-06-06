import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Building, 
  GraduationCap, 
  DollarSign, 
  Award, 
  CheckCircle, 
  Users, 
  Clock, 
  Bookmark, 
  PlusCircle, 
  Compass,
  Star,
  BookOpen,
  Info
} from 'lucide-react';
import { College, UserSession, Application, ChecklistItem, ApplicationStatus } from '../types';
import { COLLEGES_DATA } from '../data/colleges';

interface DetailsProps {
  collegeId: string;
  setActivePage: (p: any) => void;
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
}

export const Details: React.FC<DetailsProps> = ({
  collegeId,
  setActivePage,
  session,
  setSession,
  applications,
  setApplications
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'admissions'>('overview');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const col = COLLEGES_DATA.find(x => x.id === collegeId);

  if (!col) {
    return (
      <div className="p-12 text-center bg-white">
        <p className="text-sm text-slate-500 font-sans">University record not loaded.</p>
        <button onClick={() => setActivePage('explore')} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs text-white">
          Back to Directory
        </button>
      </div>
    );
  }

  const isSaved = session.savedColleges.includes(col.id);

  const toggleSaveCol = () => {
    if (!session.isLoggedIn) {
      setActivePage('auth');
      return;
    }
    setSession(prev => {
      const saved = prev.savedColleges.includes(col.id) 
        ? prev.savedColleges.filter(x => x !== col.id) 
        : [...prev.savedColleges, col.id];
      return { ...prev, savedColleges: saved };
    });
  };

  // Toggle saving specific Major/Course programs
  const toggleSaveCourse = (majorName: string) => {
    if (!session.isLoggedIn) {
      setActivePage('auth');
      return;
    }
    const courseStr = `${col.name} - ${majorName}`;
    setSession(prev => {
      const isSavedCourse = prev.savedCourses.includes(courseStr);
      const newSaved = isSavedCourse 
        ? prev.savedCourses.filter(x => x !== courseStr) 
        : [...prev.savedCourses, courseStr];
      return { ...prev, savedCourses: newSaved };
    });
  };

  // Add college directly into Application Tracker!
  const handleApplyNow = () => {
    if (!session.isLoggedIn) {
      setActivePage('auth');
      return;
    }

    // Check if copy already exists in tracker
    const alreadyExists = applications.some(a => a.collegeId === col.id);
    if (alreadyExists) {
      setActivePage('tracker');
      return;
    }

    const defaultChecklist: ChecklistItem[] = [
      { id: '1', text: 'Draft Personal Statement & prompts Essay', completed: false },
      { id: '2', text: 'Request Official Transcripts from High School Counselor', completed: false },
      { id: '3', text: 'Secure Two Letters of Recommendation (STEM/Humanities)', completed: false },
      { id: '4', text: 'Submitting standardized SAT/ACT Score logs', completed: false },
      { id: '5', text: 'Complete supplementary portfolios (if design/CS)', completed: false }
    ];

    const newApp: Application = {
      id: `app-${col.id}-${Date.now()}`,
      collegeId: col.id,
      collegeName: col.name,
      course: session.major || col.majors[0],
      status: 'Draft',
      term: 'Fall 2026',
      deadline: col.admissionDeadline.split('(')[0].trim() || 'January 1',
      checklist: defaultChecklist,
      notes: `Targeting admission into the flagship ${session.major || col.majors[0]} department.`
    };

    setApplications(prev => [newApp, ...prev]);
    setAddedSuccess(true);
    setTimeout(() => {
      setActivePage('tracker');
    }, 1200);
  };

  // Calculate detailed localized real-time admission chances for this particular college!
  const calculateChances = () => {
    let score = 0;
    
    // GPA Factor: Comparison to avgGPA standard
    const gpaDiff = session.gpa - col.avgGPA;
    if (gpaDiff >= 0) {
      score += 45; // exceeds avg gpa
    } else if (gpaDiff >= -0.2) {
      score += 30; // very close matches
    } else if (gpaDiff >= -0.5) {
      score += 15; // backup range
    } else {
      score += 5; // challenge scale
    }

    // SAT Factor
    const satDiff = session.sat - col.avgSAT;
    if (satDiff >= 0) {
      score += 35;
    } else if (satDiff >= -80) {
      score += 20;
    } else if (satDiff >= -150) {
      score += 10;
    } else {
      score += 2;
    }

    // EC Factor
    const ecScore = session.extracurriculars * 4; // Max 20 points
    score += ecScore;

    // AP Count factor
    const apScore = Math.min(10, session.apCount * 2); // Max 10 points
    score += apScore;

    // Normalizing caps according to raw selectivity
    // Elite colleges have acceptance rate dampening (even standard perfect scores face selectivity limits)
    let acceptanceDampener = col.acceptanceRate / 100.0;
    let baseChance = Math.min(98, Math.max(3, score));
    
    // Scale chances to fit college constraints
    let admissionChance = baseChance;
    if (col.acceptanceRate < 5) {
      // Very low acceptance (Harvard, MIT, Stanford)
      admissionChance = Math.min(38, baseChance / 2.5);
    } else if (col.acceptanceRate < 15) {
      admissionChance = Math.min(55, baseChance / 1.7);
    } else if (col.acceptanceRate < 30) {
      admissionChance = Math.min(78, baseChance / 1.25);
    }

    // Determine target category
    let category: 'Reach' | 'Target' | 'Safety' = 'Reach';
    if (admissionChance >= 75) {
      category = 'Safety';
    } else if (admissionChance >= 40) {
      category = 'Target';
    }

    return {
      percent: Math.round(admissionChance),
      category,
      gpaMet: session.gpa >= col.avgGPA,
      satMet: session.sat >= col.avgSAT
    };
  };

  const myChances = calculateChances();

  return (
    <div id="college-details-screen" className="bg-slate-50/50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Navigation Actions bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePage('explore')}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-350 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSaveCol}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-350 transition"
            >
              <Star className={`h-4 w-4 ${isSaved ? 'fill-yellow-400 text-yellow-500' : ''}`} />
              <span>{isSaved ? 'Saved to List' : 'Save Institution'}</span>
            </button>
          </div>
        </div>

        {/* Brand Banner Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs">
          <div className="relative h-64 sm:h-80 bg-slate-150">
            <img 
              src={col.image} 
              alt={col.name} 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            
            {/* Meta Tags positioned over banner */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-md bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                  Rank #{col.ranking} Worldwide
                </span>
                <h1 className="font-sans text-2xl font-extrabold sm:text-3xl lg:text-4xl tracking-tight leading-tight">
                  {col.name}
                </h1>
                <p className="flex items-center text-xs font-medium text-slate-200">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {col.location} | {col.country}
                </p>
              </div>

              {/* Action Apply button */}
              <button
                onClick={handleApplyNow}
                disabled={addedSuccess}
                className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-slate-950 shadow-md hover:bg-slate-50 transition shrink-0 active:scale-[0.99] disabled:bg-emerald-50 disabled:text-emerald-700"
              >
                {addedSuccess ? '✓ Application Instantiated!' : 'Add to Application Tracker'}
              </button>
            </div>
          </div>
        </div>

        {/* Details and Sidebar split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Area (Grows to Left) (Span 2) */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
            
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-4 font-sans text-xs font-bold border-b-2 transition -mb-px ${
                  activeTab === 'overview' 
                    ? 'border-slate-900 text-slate-950' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Campus Overview
              </button>
              <button
                onClick={() => setActiveTab('academics')}
                className={`py-3 px-4 font-sans text-xs font-bold border-b-2 transition -mb-px ${
                  activeTab === 'academics' 
                    ? 'border-slate-900 text-slate-950' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Academics & Concentration Programs
              </button>
              <button
                onClick={() => setActiveTab('admissions')}
                className={`py-3 px-4 font-sans text-xs font-bold border-b-2 transition -mb-px ${
                  activeTab === 'admissions' 
                    ? 'border-slate-900 text-slate-950' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Historic Requirements
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 font-sans">
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">About the University</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">{col.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="rounded-2xl border border-slate-50 p-4 bg-slate-50/20 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Campus Life & Engagement</span>
                    <p className="text-xs text-slate-650 leading-relaxed">{col.campusLife}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-50 p-4 bg-slate-50/20 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Financial Aid Overview</span>
                    <p className="text-xs text-slate-650 leading-relaxed">{col.financialAid}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/50 text-slate-700">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Enrollment</p>
                      <p className="font-mono text-sm font-bold text-slate-950">{(col.studentBodySize/1000).toFixed(0)}k Students</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/50 text-slate-700">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Grad Rate</p>
                      <p className="font-mono text-sm font-bold text-slate-950">{col.graduationRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/50 text-slate-700">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Deadline</p>
                      <p className="font-mono text-xs font-bold text-slate-950 truncate">{col.admissionDeadline.split('(')[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Academics */}
            {activeTab === 'academics' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Available Major Fields</h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Bookmark particular degree fields to save them to your active personal academic course tracker.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {col.majors.map((major) => {
                    const isProgramSaved = session.savedCourses.includes(`${col.name} - ${major}`);
                    return (
                      <div
                        key={major}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 bg-linear-to-b from-slate-50/20 to-white"
                      >
                        <span className="text-xs font-bold text-slate-900">{major}</span>
                        <button
                          onClick={() => toggleSaveCourse(major)}
                          className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
                            isProgramSaved 
                              ? 'border-slate-800 bg-slate-900 text-white' 
                              : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                          }`}
                          title={isProgramSaved ? 'Remove Major' : 'Save Major'}
                        >
                          <Star className={`h-3 w-3 ${isProgramSaved ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Historic Requirements */}
            {activeTab === 'admissions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Admitted Score Benchmarks</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    These are the median 50% percentile scores for students matriculated in previous cohorts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/20 text-center space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Average GPA</p>
                    <p className="font-mono text-xl font-bold text-slate-950">{col.avgGPA}</p>
                    <p className="text-[10px] text-slate-400">Class percentile ~95%</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/20 text-center space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Average SAT</p>
                    <p className="font-mono text-xl font-bold text-slate-950">{col.avgSAT}</p>
                    <p className="text-[10px] text-slate-400">Combined Reading/Math</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/20 text-center space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Average ACT</p>
                    <p className="font-mono text-xl font-bold text-slate-950">{col.avgACT}</p>
                    <p className="text-[10px] text-slate-400">Composite score floor</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/50 flex gap-3 text-xs leading-relaxed text-slate-650">
                  <Info className="h-5 w-5 text-slate-450 shrink-0" />
                  <p>
                    Admissions profiles are evaluated holistically. Standardized test score submissions may be optional or recommended depending on current active state policies.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Probability Dashboard Widget Sidebar (Right-hand Column) (Span 1) */}
          <div className="flex flex-col space-y-8">
            
            {/* Admissibility Analyzer Card */}
            <div id="chance-analyzer-card" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-sans text-sm font-bold text-slate-950">Chances Analyzer</h3>
              <p className="text-xs text-slate-500 font-sans">
                Real-time admission range computed from your active profile:
              </p>

              {/* Admission percentage Circular Gauge or Dial representation */}
              <div className="text-center py-6 border-b border-slate-50">
                <div className="inline-flex items-center justify-center relative">
                  {/* Gauge Ring */}
                  <div className="absolute inset-0 rounded-full border-12 border-slate-100" />
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-b from-slate-50 to-slate-100 shadow-inner">
                    <div>
                      <p className="font-mono text-3xl font-extrabold text-slate-950">{myChances.percent}%</p>
                      <p className={`text-[10px] font-bold px-2 py-0.5 mt-1 rounded-full uppercase tracking-wider ${
                        myChances.category === 'Safety' ? 'bg-emerald-50 text-emerald-700' :
                        myChances.category === 'Target' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {myChances.category}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-sans mt-4">
                  Match Status: <span className="text-slate-950 font-bold">{myChances.category} Class</span>
                </p>
              </div>

              {/* Factors checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-550">GPA Comparison</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${myChances.gpaMet ? 'text-emerald-700' : 'text-slate-500'}`}>
                    <CheckCircle className={`h-3.5 w-3.5 ${myChances.gpaMet ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>{session.gpa >= col.avgGPA ? 'Above average' : 'Below average'}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-550">SAT Target floor</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${myChances.satMet ? 'text-emerald-700' : 'text-slate-500'}`}>
                    <CheckCircle className={`h-3.5 w-3.5 ${myChances.satMet ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>{session.sat >= col.avgSAT ? 'Matches floor' : 'Under floor'}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-550">Extra-curricular profile</span>
                  <span className="font-mono font-bold text-slate-905">Lvl {session.extracurriculars}/5</span>
                </div>
              </div>

              <button
                onClick={() => setActivePage('predictor')}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 text-center transition block"
              >
                Modify profile metrics on AI Predictor
              </button>
            </div>

            {/* Quick general metrics list */}
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Cost & aid guide</span>
              <div className="space-y-2 font-sans text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-500">
                  <span>Yearly Tuition Fee</span>
                  <span className="font-mono text-slate-900 font-semibold">${col.tuition.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-500">
                  <span>Admissibility Deadline</span>
                  <span className="font-mono text-slate-900 font-semibold">{col.admissionDeadline.split('(')[0]}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
