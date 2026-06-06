import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  ArrowRight,
  RefreshCw,
  Award,
  ChevronRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { PredictionInput, PredictionRecord, PredictionDetail, UserSession, College, ActivePage } from '../types';
import { COLLEGES_DATA } from '../data/colleges';

interface PredictorProps {
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  history: PredictionRecord[];
  setHistory: React.Dispatch<React.SetStateAction<PredictionRecord[]>>;
  activePage: ActivePage;
  setActivePage: React.Dispatch<React.SetStateAction<ActivePage>>;
  setSelectedCollegeId: (id: string) => void;
}

export const Predictor: React.FC<PredictorProps> = ({
  session,
  setSession,
  history,
  setHistory,
  activePage,
  setActivePage,
  setSelectedCollegeId
}) => {
  // Navigation internal tab states
  // 'inputs' | 'results' | 'history'
  const [internalTab, setInternalTab] = useState<'inputs' | 'results' | 'history'>('inputs');

  const [inputGPA, setInputGPA] = useState(session.gpa);
  const [inputSAT, setInputSAT] = useState(session.sat);
  const [inputACT, setInputACT] = useState(session.act);
  const [inputEC, setInputEC] = useState(session.extracurriculars);
  const [inputAP, setInputAP] = useState(session.apCount);
  const [inputMajor, setInputMajor] = useState(session.major);
  const [inputState, setInputState] = useState('CA');

  // Currently viewing results record
  const [activeRecordId, setActiveRecordId] = useState<string | null>(history[0]?.id || null);
  const [selectedAuditCollegeId, setSelectedAuditCollegeId] = useState<string | null>(null);

  const activeRecord = history.find(h => h.id === activeRecordId);

  // Extracurricular description details
  const ecTiers = [
    { lvl: 1, title: 'Casual Involvement', desc: 'No leadership roles, simple club memberships or local hobbies.' },
    { lvl: 2, title: 'Active Scholar', desc: 'Active multi-club member, standard high school sports or volunteer hours.' },
    { lvl: 3, title: 'Regional Leader', desc: 'Club President, regional athletics Captain, significant regional awards.' },
    { lvl: 4, title: 'State Champion', desc: 'Statewide music/STEM prizes, founder of major charity, student body leader.' },
    { lvl: 5, title: 'Elite Trailblazer', desc: 'National Olympiad Medalist, published scientist, venture-backed tech founder.' }
  ];

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Gather inputs
    const predictInput: PredictionInput = {
      gpa: Number(inputGPA.toFixed(2)),
      sat: inputSAT,
      act: inputACT,
      extracurriculars: inputEC,
      apCount: inputAP,
      major: inputMajor,
      state: inputState
    };

    // 2. Perform algorithmic simulations for all 15 colleges we have in database
    const simulationResults: Record<string, PredictionDetail> = {};

    COLLEGES_DATA.forEach((col) => {
      let gpaScoreFactor = 0;
      let satScoreFactor = 0;
      let ecScoreFactor = predictInput.extracurriculars * 4; // Max 20 points
      let apScoreFactor = Math.min(10, predictInput.apCount * 2); // Max 10 points

      // Calculate GPA factor
      const gpaDiff = predictInput.gpa - col.avgGPA;
      if (gpaDiff >= 0) gpaScoreFactor = 45;
      else if (gpaDiff >= -0.2) gpaScoreFactor = 30;
      else if (gpaDiff >= -0.5) gpaScoreFactor = 15;
      else gpaScoreFactor = 5;

      // Calculate SAT factor
      const satDiff = predictInput.sat - col.avgSAT;
      if (satDiff >= 0) satScoreFactor = 35;
      else if (satDiff >= -80) satScoreFactor = 20;
      else if (satDiff >= -150) satScoreFactor = 10;
      else satScoreFactor = 2;

      let scoreTotal = gpaScoreFactor + satScoreFactor + ecScoreFactor + apScoreFactor;

      // Acceptance rate dampening
      let adChance = scoreTotal;
      if (col.acceptanceRate < 5) {
        adChance = Math.min(38, scoreTotal / 2.5);
      } else if (col.acceptanceRate < 15) {
        adChance = Math.min(55, scoreTotal / 1.7);
      } else if (col.acceptanceRate < 30) {
        adChance = Math.min(78, scoreTotal / 1.25);
      } else {
        adChance = Math.min(98, scoreTotal);
      }

      adChance = Math.round(Math.max(2, adChance));

      let adCategory: 'Reach' | 'Target' | 'Safety' = 'Reach';
      if (adChance >= 75) adCategory = 'Safety';
      else if (adChance >= 40) adCategory = 'Target';

      simulationResults[col.id] = {
        chance: adChance,
        category: adCategory,
        factorGPA: gpaScoreFactor,
        factorSAT: satScoreFactor,
        factorEC: ecScoreFactor,
        factorAP: apScoreFactor
      };
    });

    const newRecord: PredictionRecord = {
      id: `pred-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      input: predictInput,
      results: simulationResults
    };

    // Update global history and user session stats so things stay in sync!
    setHistory(prev => [newRecord, ...prev]);
    setSession(prev => ({
      ...prev,
      gpa: predictInput.gpa,
      sat: predictInput.sat,
      act: predictInput.act,
      extracurriculars: predictInput.extracurriculars,
      apCount: predictInput.apCount,
      major: predictInput.major
    }));

    setActiveRecordId(newRecord.id);
    setInternalTab('results');
    setSelectedAuditCollegeId(null);
  };

  const handleLoadHistory = (rec: PredictionRecord) => {
    // Load historical inputs back to forms as well!
    setInputGPA(rec.input.gpa);
    setInputSAT(rec.input.sat);
    setInputACT(rec.input.act);
    setInputEC(rec.input.extracurriculars);
    setInputAP(rec.input.apCount);
    setInputMajor(rec.input.major);
    setInputState(rec.input.state);

    setActiveRecordId(rec.id);
    setInternalTab('results');
    setSelectedAuditCollegeId(null);
  };

  return (
    <div id="predictor-full-screen" className="bg-slate-50/50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Banner with segmented tab selections */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-1">
              <Sparkles className="h-3 w-3 text-yellow-300" />
              Formula Metric Modeler
            </span>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2">
              <Calculator className="h-7 w-7 text-slate-950" />
              Admissions Chance Predictor
            </h1>
          </div>

          {/* Tab segmentation */}
          <div className="flex border border-slate-200 bg-white rounded-xl p-1 shrink-0">
            <button
              onClick={() => setInternalTab('inputs')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                internalTab === 'inputs' ? 'bg-slate-900 text-white' : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              Modify Scores
            </button>
            <button
              onClick={() => {
                if (!activeRecordId && history.length > 0) {
                  setActiveRecordId(history[0].id);
                }
                setInternalTab('results');
              }}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                internalTab === 'results' ? 'bg-slate-900 text-white' : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              See Live Chances ({activeRecord ? '1 active' : 'None'})
            </button>
            <button
              onClick={() => setInternalTab('history')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                internalTab === 'history' ? 'bg-slate-900 text-white' : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              Simulation Logs ({history.length})
            </button>
          </div>
        </div>

        {/* Tab content: INPUTS FORM */}
        {internalTab === 'inputs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left forms side (Span 2) */}
            <form onSubmit={handlePredict} className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="border-b border-slate-50 pb-3">
                <h3 className="font-sans text-md font-bold text-slate-950">Academic Requirements & Score Profiles</h3>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Slide or select your standardized evaluation indices to gauge percentile ranges.
                </p>
              </div>

              {/* Slider GPA SAT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Unweighted GPA</span>
                    <span className="font-mono text-slate-950 text-sm font-extrabold">{inputGPA.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="4.0"
                    step="0.05"
                    value={inputGPA}
                    onChange={(e) => setInputGPA(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>2.0 GPA</span>
                    <span>4.0 GPA (Perfect)</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>SAT Composite score</span>
                    <span className="font-mono text-slate-950 text-sm font-extrabold">{inputSAT}</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1600"
                    step="10"
                    value={inputSAT}
                    onChange={(e) => setInputSAT(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>400</span>
                    <span>1600 (Perfect)</span>
                  </div>
                </div>
              </div>

              {/* Slider ACT and AP Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>ACT composite score</span>
                    <span className="font-mono text-slate-950 text-sm font-extrabold">{inputACT}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="36"
                    step="1"
                    value={inputACT}
                    onChange={(e) => setInputACT(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1 ACT</span>
                    <span>36 ACT (Perfect)</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Completed AP / IB courses</span>
                    <span className="font-mono text-slate-950 text-sm font-extrabold">{inputAP} classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={inputAP}
                    onChange={(e) => setInputAP(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>0 classes</span>
                    <span>15+ AP/IB subjects</span>
                  </div>
                </div>
              </div>

              {/* Star-based Extracurricular evaluation (Tier 1-5 selection) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Extra-Curricular Engagement Rating
                </label>
                
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setInputEC(lvl)}
                      className={`h-9 w-9 flex items-center justify-center rounded-xl border transition ${
                        inputEC >= lvl 
                          ? 'border-slate-800 bg-slate-900 text-yellow-350 shadow-sm' 
                          : 'border-slate-250 bg-white text-slate-350 hover:border-slate-400'
                      }`}
                    >
                      <Star className={`h-4.5 w-4.5 ${inputEC >= lvl ? 'fill-yellow-400' : ''}`} />
                    </button>
                  ))}
                  <span className="font-sans text-xs font-bold text-slate-700 ml-2">
                    Lvl {inputEC}: {ecTiers[inputEC - 1]?.title}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-50 bg-slate-50/50 p-4 text-xs font-sans text-slate-650 leading-relaxed">
                  <p className="font-bold text-slate-900 mb-1">Impact Description:</p>
                  <p>{ecTiers[inputEC - 1]?.desc}</p>
                </div>
              </div>

              {/* Major demographic dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Intended Major Selection</label>
                  <select
                    value={inputMajor}
                    onChange={(e) => setInputMajor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-slate-350 focus:outline-none"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical Engineering">Mechanical Engineering / STEM</option>
                    <option value="Economics">Economics / Finance Business</option>
                    <option value="Biology/Medicine">Biology / Pre-Med</option>
                    <option value="Political Science">Political Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">US State Census / Residency</label>
                  <select
                    value={inputState}
                    onChange={(e) => setInputState(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-slate-350 focus:outline-none"
                  >
                    <option value="CA">California (CA)</option>
                    <option value="MA">Massachusetts (MA)</option>
                    <option value="NY">New York (NY)</option>
                    <option value="GA">Georgia (GA)</option>
                    <option value="TX">Texas (TX)</option>
                    <option value="AZ">Arizona (AZ)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 text-white font-bold py-3.5 shadow-sm text-sm hover:bg-slate-800 transition block"
              >
                Assemble Simulation Outcomes
              </button>

            </form>

            {/* Sidebar quick guides (Span 1) */}
            <div className="space-y-6">
              
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Simulation Help Guide</span>
                <h3 className="font-sans text-sm font-bold text-slate-950 leading-tight">Percentile Evaluations</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-sans">
                  All models calculations operate on previous cohorts 50% benchmarks. Factors undergo holistic corrections: GPA receives a 45% weighting, SAT represents 35%, while leadership stars and coursework fill the remaining brackets.
                </p>
                
                <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/50 flex gap-2.5 text-[11px] leading-relaxed text-slate-500">
                  <Info className="h-4.5 w-4.5 text-slate-450 shrink-0" />
                  <p>
                    All chances are client-side simulations. Admissions are fundamentally random, please treat outcomes purely as indicator bounds.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab content: RESULTS TIERS */}
        {internalTab === 'results' && (
          <div className="space-y-6">
            
            {/* If no simulation executed yet */}
            {!activeRecord ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs animate-fadeIn">
                <Calculator className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                <p className="font-sans text-sm font-bold text-slate-900">No Simulation Active</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Please configure your test scores and click predict above.</p>
                <button
                  onClick={() => setInternalTab('inputs')}
                  className="mt-4 rounded-xl bg-slate-905 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  Configure Profile Metrics →
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Active Profile Teaser Banner */}
                <div className="rounded-2xl border border-slate-100 bg-slate-900 text-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <p className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider">Simulated Target Profile Profile</p>
                    <p className="font-sans text-sm font-bold">
                      GPA: <span className="font-mono text-slate-300">{activeRecord.input.gpa}</span> | SAT: <span className="font-mono text-slate-300">{activeRecord.input.sat}</span> | Major: <span className="text-slate-300">{activeRecord.input.major}</span>
                    </p>
                    <p className="text-[10px] text-slate-450 font-sans">
                      AP classes completed: <span className="font-bold text-white">{activeRecord.input.apCount}</span> | Extracurricular level: <span className="font-bold text-white">Lvl {activeRecord.input.extracurriculars}/5</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setInternalTab('inputs')}
                    className="flex justify-center items-center space-x-1.5 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs text-slate-100 font-bold transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Run Different Scores</span>
                  </button>
                </div>

                {/* 3 Columns sorting of colleges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Column 1: SAFETY (Chances >= 75%) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-50" />
                        Safety Matches (Chances ≥ 75%)
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {COLLEGES_DATA.filter(col => activeRecord.results[col.id]?.category === 'Safety').length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-6">None registered</p>
                      ) : (
                        COLLEGES_DATA.filter(col => activeRecord.results[col.id]?.category === 'Safety').map(col => {
                          const res = activeRecord.results[col.id];
                          const isAuditing = selectedAuditCollegeId === col.id;
                          return (
                            <div 
                              key={col.id}
                              onClick={() => {
                                setSelectedAuditCollegeId(col.id);
                              }}
                              className={`rounded-2xl border p-4 cursor-pointer transition ${
                                isAuditing ? 'border-emerald-500 bg-emerald-50/5' : 'border-slate-100 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="truncate">
                                  <h4 className="font-sans text-xs font-extrabold text-slate-900 group-hover:text-slate-750 line-clamp-1">{col.name}</h4>
                                  <p className="text-[10px] text-slate-400 flex items-center mt-0.5"><Layers className="h-3 w-3 mr-1" />Rank #{col.ranking}</p>
                                </div>
                                <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-lg shrink-0">{res.chance}%</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Column 2: TARGET (Chances 40% - 75%) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                        Target Matches (40% - 74%)
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {COLLEGES_DATA.filter(col => activeRecord.results[col.id]?.category === 'Target').length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-6">None registered</p>
                      ) : (
                        COLLEGES_DATA.filter(col => activeRecord.results[col.id]?.category === 'Target').map(col => {
                          const res = activeRecord.results[col.id];
                          const isAuditing = selectedAuditCollegeId === col.id;
                          return (
                            <div 
                              key={col.id}
                              onClick={() => {
                                setSelectedAuditCollegeId(col.id);
                              }}
                              className={`rounded-2xl border p-4 cursor-pointer transition ${
                                isAuditing ? 'border-amber-500 bg-amber-50/5' : 'border-slate-100 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="truncate">
                                  <h4 className="font-sans text-xs font-extrabold text-slate-900 group-hover:text-slate-755 line-clamp-1">{col.name}</h4>
                                  <p className="text-[10px] text-slate-400 flex items-center mt-0.5"><Layers className="h-3 w-3 mr-1" />Rank #{col.ranking}</p>
                                </div>
                                <span className="font-mono text-xs font-extrabold text-amber-700 bg-amber-100/50 px-2.5 py-1 rounded-lg shrink-0">{res.chance}%</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Column 3: REACH (Chances < 40%) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        Reach Matches (Chances &lt; 40%)
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {COLLEGES_DATA.filter(col => activeRecord.results[col.id]?.category === 'Reach').length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-6">None registered</p>
                      ) : (
                        COLLEGES_DATA.filter(col => activeRecord.results[col.id]?.category === 'Reach').map(col => {
                          const res = activeRecord.results[col.id];
                          const isAuditing = selectedAuditCollegeId === col.id;
                          return (
                            <div 
                              key={col.id}
                              onClick={() => {
                                setSelectedAuditCollegeId(col.id);
                              }}
                              className={`rounded-2xl border p-4 cursor-pointer transition ${
                                isAuditing ? 'border-rose-500 bg-rose-50/5' : 'border-slate-100 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="truncate">
                                  <h4 className="font-sans text-xs font-extrabold text-slate-900 group-hover:text-slate-750 line-clamp-1">{col.name}</h4>
                                  <p className="text-[10px] text-slate-400 flex items-center mt-0.5"><Layers className="h-3 w-3 mr-1" />Rank #{col.ranking}</p>
                                </div>
                                <span className="font-mono text-xs font-extrabold text-rose-700 bg-rose-100/50 px-2.5 py-1 rounded-lg shrink-0">{res.chance}%</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

                {/* Sub audit break-downs for SELECTED college */}
                {selectedAuditCollegeId && (
                  (() => {
                    const colObj = COLLEGES_DATA.find(x => x.id === selectedAuditCollegeId);
                    const colRes = activeRecord.results[selectedAuditCollegeId];
                    if (!colObj) return null;

                    return (
                      <div className="rounded-3xl border border-slate-150 bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6 animate-fadeIn">
                        
                        <div className="md:w-1/3 space-y-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Metric details</span>
                          <h3 className="font-sans text-md font-bold text-slate-905">{colObj.name}</h3>
                          <p className="text-xs text-slate-500 font-sans leading-relaxed">{colObj.location}</p>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <span className="font-mono text-3xl font-extrabold text-slate-950">{colRes.chance}%</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              colRes.category === 'Reach' ? 'bg-rose-50 text-rose-700' :
                              colRes.category === 'Target' ? 'bg-amber-50 text-amber-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {colRes.category} Classification
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedCollegeId(colObj.id);
                              setActivePage('details');
                            }}
                            className="text-xs font-bold text-slate-900 border-b border-slate-800 hover:text-slate-650 transition pt-2 flex items-center gap-1"
                          >
                            <span>Explore Admissions Requirements</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Audit specific bars progress */}
                        <div className="md:w-2/3 space-y-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Points allocation breakdown</span>
                          
                          <div className="space-y-3 text-xs font-sans">
                            {/* GPA match */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-slate-600 font-semibold">
                                <span>Academic GPA matching weight (avg required: {colObj.avgGPA})</span>
                                <span className="font-mono text-slate-900 font-bold">{colRes.factorGPA} / 45 pts</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-slate-900 duration-500" style={{ width: `${(colRes.factorGPA/45)*100}%` }} />
                              </div>
                            </div>

                            {/* SAT match */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-slate-600 font-semibold">
                                <span>Standardized SAT percentile match (avg required: {colObj.avgSAT})</span>
                                <span className="font-mono text-slate-900 font-bold">{colRes.factorSAT} / 35 pts</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-slate-900 duration-500" style={{ width: `${(colRes.factorSAT/35)*100}%` }} />
                              </div>
                            </div>

                            {/* Leadership boost */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-slate-600 font-semibold">
                                <span>Leadership star & Extracurricular boost (Level {activeRecord.input.extracurriculars}/5)</span>
                                <span className="font-mono text-slate-900 font-bold">{colRes.factorEC} / 20 pts</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-slate-905 duration-500" style={{ width: `${(colRes.factorEC/20)*100}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()
                )}

              </div>
            )}

          </div>
        )}

        {/* Tab content: SIMULATION LOGS HISTORY */}
        {internalTab === 'history' && (
          <div className="space-y-4 font-sans animate-fadeIn">
            {history.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-105 shadow-xs">
                <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                <p className="font-sans text-sm font-bold text-slate-900">Simulation Logs are Empty</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Run active predictor analyses. All previous records are tracked here.</p>
                <button
                  type="button"
                  onClick={() => setInternalTab('inputs')}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Configure Scores Profile
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-4">Simulation Timestamp</th>
                      <th className="py-3 px-4">GPA Input</th>
                      <th className="py-3 px-4">SAT Input</th>
                      <th className="py-3 px-4">AP Subject classes</th>
                      <th className="py-3 px-4">Concentration Select</th>
                      <th className="py-3 px-4">Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/45 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 italic flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {rec.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">{rec.input.gpa}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">{rec.input.sat}</td>
                        <td className="py-3.5 px-4 text-slate-650">{rec.input.apCount} AP courses</td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">{rec.input.major}</td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleLoadHistory(rec)}
                            className="rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 hover:border-slate-350 transition flex items-center gap-1"
                          >
                            <span>Reload Profile</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
