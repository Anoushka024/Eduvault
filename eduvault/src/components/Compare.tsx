import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  MapPin, 
  Trash2, 
  Plus, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Award,
  Star
} from 'lucide-react';
import { COLLEGES_DATA } from '../data/colleges';
import { College, UserSession, ActivePage } from '../types';

interface CompareProps {
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  setActivePage: (p: ActivePage) => void;
  setSelectedCollegeId: (id: string) => void;
}

export const Compare: React.FC<CompareProps> = ({
  session,
  setSession,
  setActivePage,
  setSelectedCollegeId
}) => {
  // Store up to 3 college IDs to compare
  const [comparedIds, setComparedIds] = useState<string[]>(['harvard', 'berkeley']);
  const [selectValue, setSelectValue] = useState('');

  const comparedColleges = useMemo(() => {
    return comparedIds
      .map(id => COLLEGES_DATA.find(c => c.id === id))
      .filter((c): c is College => !!c);
  }, [comparedIds]);

  // Handle adding a college to the comparison slots
  const handleAddCollege = (id: string) => {
    if (!id) return;
    if (comparedIds.includes(id)) {
      setSelectValue('');
      return;
    }
    if (comparedIds.length >= 3) {
      alert("You can compare up to 3 colleges side-by-side.");
      setSelectValue('');
      return;
    }
    setComparedIds(prev => [...prev, id]);
    setSelectValue('');
  };

  const handleRemoveCollege = (id: string) => {
    setComparedIds(prev => prev.filter(x => x !== id));
  };

  // Recommendations: Find colleges with similar stats to put as helper links
  const availableOptions = COLLEGES_DATA.filter(c => !comparedIds.includes(c.id));

  // Determine closest match automatically!
  const getSafestBestMatch = () => {
    if (comparedColleges.length === 0) return null;
    let closestId = comparedColleges[0].id;
    let minGap = Infinity;

    comparedColleges.forEach(col => {
      // Find gap between user scores and student averages
      const gap = Math.max(0, col.avgGPA - session.gpa) * 100 + Math.max(0, col.avgSAT - session.sat) / 10;
      if (gap < minGap) {
        minGap = gap;
        closestId = col.id;
      }
    });

    return closestId;
  };

  const bestMatchId = getSafestBestMatch();

  return (
    <div id="compare-cols-screen" className="bg-slate-50/50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header Title section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 animate-fadeIn">
          <div>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2">
              <ArrowRightLeft className="h-7 w-7 text-slate-950" />
              Side-by-Side Comparison Matrix
            </h1>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Select and analyze up to three academic rosters simultaneously across scores, costs, and graduation output indices.
            </p>
          </div>

          {/* Quick Dropdown selector */}
          {comparedIds.length < 3 ? (
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add College:</span>
              <select
                value={selectValue}
                onChange={(e) => handleAddCollege(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              >
                <option value="">-- Choose target university --</option>
                {availableOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Global Rank #{c.ranking})</option>
                ))}
              </select>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-400">All slots configured</span>
          )}
        </div>

        {/* Matrix comparison Grid representation */}
        {comparedColleges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-150 shadow-xs">
            <Plus className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
            <p className="font-sans text-sm font-bold text-slate-900">Compare Matrix is Empty</p>
            <p className="text-xs text-slate-500 font-sans mt-1">Select colleges from the top-right select menu to compare rankings side-by-side.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparedColleges.map((col) => {
              const isBestFit = col.id === bestMatchId;
              const isSaved = session.savedColleges.includes(col.id);

              return (
                <div
                  key={col.id}
                  className={`relative rounded-3xl border bg-white shadow-xs p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                    isBestFit ? 'border-slate-800 ring-2 ring-slate-100/50' : 'border-slate-100'
                  }`}
                >
                  {/* Highlight Ribbon for Best Fit */}
                  {isBestFit && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      Best Academic Fit
                    </span>
                  )}

                  {/* Header info */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Global Rank #{col.ranking}</p>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSession(prev => {
                              const saved = prev.savedColleges.includes(col.id);
                              const newSaved = saved 
                                ? prev.savedColleges.filter(x => x !== col.id) 
                                : [...prev.savedColleges, col.id];
                              return { ...prev, savedColleges: newSaved };
                            });
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-yellow-500 transition"
                          title="Save Bookmark"
                        >
                          <Star className={`h-4 w-4 ${isSaved ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleRemoveCollege(col.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Remove Comparison Card"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-sans text-md font-bold text-slate-950 hover:underline cursor-pointer line-clamp-1" onClick={() => { setSelectedCollegeId(col.id); setActivePage('details'); }}>
                        {col.name}
                      </h3>
                      <p className="font-sans text-xs text-slate-500 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {col.location}
                      </p>
                    </div>

                    {/* Stat Metrics lists */}
                    <div className="border-t border-slate-100 pt-4 space-y-3.5 font-sans text-xs">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Student Body Size:</span>
                        <span className="font-mono text-slate-900 font-bold flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          {col.studentBodySize.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Acceptance Rate:</span>
                        <span className="font-mono text-slate-900 font-bold block">
                          {col.acceptanceRate}%
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Yearly Tuition fee:</span>
                        <span className="font-mono text-slate-900 font-bold flex items-center block">
                          ${col.tuition.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Average Admitted GPA:</span>
                        <span className="font-mono text-slate-900 font-bold block">
                          {col.avgGPA}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Average SAT:</span>
                        <span className="font-mono text-slate-900 font-bold block">
                          {col.avgSAT}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-slate-500">Graduation rate:</span>
                        <span className="font-mono text-slate-900 font-bold flex items-center">
                          <Award className="h-3.5 w-3.5 r-1 text-slate-400" />
                          {col.graduationRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nav links to Details */}
                  <div className="pt-4 border-t border-slate-150 mt-6 flex items-center justify-between text-xs font-bold text-slate-900">
                    <button
                      onClick={() => { setSelectedCollegeId(col.id); setActivePage('details'); }}
                      className="hover:underline flex items-center space-x-1.5"
                    >
                      <span>Explore Requirements →</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
