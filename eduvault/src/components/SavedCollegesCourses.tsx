import React, { useState } from 'react';
import { 
  Heart, 
  Trash2, 
  Star, 
  MapPin, 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Compass,
  FileText
} from 'lucide-react';
import { COLLEGES_DATA } from '../data/colleges';
import { ActivePage, UserSession } from '../types';

interface SavedProps {
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  setActivePage: (p: ActivePage) => void;
  setSelectedCollegeId: (id: string) => void;
}

export const SavedCollegesCourses: React.FC<SavedProps> = ({
  session,
  setSession,
  setActivePage,
  setSelectedCollegeId
}) => {
  const [activeTab, setActiveTab] = useState<'colleges' | 'courses'>('colleges');

  const removeSavedCol = (id: string) => {
    setSession(prev => ({
      ...prev,
      savedColleges: prev.savedColleges.filter(x => x !== id)
    }));
  };

  const removeSavedCourse = (courseStr: string) => {
    setSession(prev => ({
      ...prev,
      savedCourses: prev.savedCourses.filter(x => x !== courseStr)
    }));
  };

  const handleCollegeClick = (id: string) => {
    setSelectedCollegeId(id);
    setActivePage('details');
  };

  return (
    <div id="saved-items-screen" className="bg-slate-50/50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Page title and headers */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 animate-fadeIn">
          <div>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2">
              <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
              My Saved Bookmarks
            </h1>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Refined directory of saved universities, majors, and concentrations for active session timelines.
            </p>
          </div>

          {/* Sub Tab switchers */}
          <div className="flex border border-slate-200 bg-white rounded-xl p-1 shrink-0">
            <button
              onClick={() => setActiveTab('colleges')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition flex items-center space-x-1 ${
                activeTab === 'colleges' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Universities ({session.savedColleges.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition flex items-center space-x-1 ${
                activeTab === 'courses' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Saved Courses ({session.savedCourses.length})</span>
            </button>
          </div>
        </div>

        {/* Tab: Saved Colleges */}
        {activeTab === 'colleges' && (
          <div className="space-y-4 font-sans animate-fadeIn">
            {session.savedColleges.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs">
                <Compass className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                <p className="font-sans text-sm font-bold text-slate-900">Your College Vault is Empty</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Go to the University Explorer and toggle the stars to save bookmarks.</p>
                <button
                  onClick={() => setActivePage('explore')}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  Browse Campus Catalog →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {session.savedColleges.map((id) => {
                  const col = COLLEGES_DATA.find(x => x.id === id);
                  if (!col) return null;
                  return (
                    <div
                      key={id}
                      className="group rounded-2xl border border-slate-100 bg-white p-4 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all duration-200"
                    >
                      {/* Left Thumbnail icon */}
                      <div 
                        onClick={() => handleCollegeClick(id)}
                        className="flex items-center space-x-3.5 cursor-pointer flex-1 min-w-0"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900 shrink-0 font-bold overflow-hidden">
                          <img src={col.image} alt={col.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                        </div>
                        <div className="truncate space-y-0.5">
                          <h3 className="font-sans text-sm font-bold text-slate-950 group-hover:text-slate-700 truncate">
                            {col.name}
                          </h3>
                          <p className="font-sans text-[10px] text-slate-400 flex items-center truncate">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {col.location} | Global Rank #{col.ranking}
                          </p>
                        </div>
                      </div>

                      {/* Side delete / detailed page redirections */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleCollegeClick(id)}
                          className="flex items-center space-x-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-800 hover:border-slate-350 bg-slate-50/50 hover:bg-white transition"
                        >
                          <span>Explore →</span>
                        </button>
                        <button
                          onClick={() => removeSavedCol(id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Unsave"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Saved Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-4 font-sans animate-fadeIn">
            {session.savedCourses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs">
                <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                <p className="font-sans text-sm font-bold text-slate-900">Your Academics Vault is Empty</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Open specific college details and click stars on key Majors/Programs to save courses.</p>
                <button
                  onClick={() => setActivePage('explore')}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  Browse Campus Majors →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {session.savedCourses.map((courseStr) => {
                  const parts = courseStr.split(' - ');
                  const collegeName = parts[0];
                  const majorName = parts[1];
                  // Find relative college ID
                  const parentCol = COLLEGES_DATA.find(x => x.name === collegeName);

                  return (
                    <div
                      key={courseStr}
                      className="group rounded-2xl border border-slate-100 bg-white p-4 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="truncate space-y-0.5 flex-1 min-w-0">
                        <span className="inline-flex items-center rounded-md bg-linear-to-r from-slate-900 to-slate-800 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider mb-1">
                          Degree Core Program
                        </span>
                        <h3 className="font-sans text-xs font-extrabold text-slate-950 truncate leading-tight">
                          {majorName}
                        </h3>
                        <p className="font-sans text-[10px] text-slate-400 truncate">
                          at {collegeName}
                        </p>
                      </div>

                      {/* Side delete / details page redirect buttons */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {parentCol && (
                          <button
                            onClick={() => handleCollegeClick(parentCol.id)}
                            className="flex items-center space-x-1 rounded-lg border border-slate-100 px-2 py-1.5 text-[10px] font-bold text-slate-800 hover:border-slate-300 bg-slate-50/20 hover:bg-white transition"
                          >
                            <span>University</span>
                          </button>
                        )}
                        <button
                          onClick={() => removeSavedCourse(courseStr)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remove course bookmark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
