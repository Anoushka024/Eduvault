import React from 'react';
import { 
  User, 
  GraduationCap, 
  ListTodo, 
  TrendingUp, 
  Star, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Calculator,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { COLLEGES_DATA } from '../data/colleges';
import { ActivePage, UserSession, Application, PredictionRecord } from '../types';

interface DashboardProps {
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  setActivePage: (p: ActivePage) => void;
  setSelectedCollegeId: (id: string) => void;
  applications: Application[];
  history: PredictionRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  session,
  setSession,
  setActivePage,
  setSelectedCollegeId,
  applications,
  history
}) => {
  // Derive details depending on user scores
  const getScoreStatus = () => {
    if (session.gpa >= 3.8 && session.sat >= 1450) {
      return { text: 'Highly Competitive Candidate', color: 'text-emerald-700 bg-emerald-50' };
    } else if (session.gpa >= 3.4 || session.sat >= 1250) {
      return { text: 'Strong Competitive Candidate', color: 'text-amber-700 bg-amber-50' };
    } else {
      return { text: 'Developing Academic Profile', color: 'text-slate-700 bg-slate-50' };
    }
  };

  const statusInfo = getScoreStatus();

  // Sort universities to provide instant targeted college recommendations on the dashboard!
  const getDashboardRecommendations = () => {
    return COLLEGES_DATA.filter(col => {
      // Show colleges where student matches GPA/SAT reasonably well or is close
      const gpaDiff = Math.abs(col.avgGPA - session.gpa);
      const satDiff = Math.abs(col.avgSAT - session.sat);
      return gpaDiff < 0.3 && satDiff < 150;
    }).slice(0, 3);
  };

  const recommendations = getDashboardRecommendations();

  // Count apps by status for visual bars
  const statusCounts = {
    Draft: applications.filter(a => a.status === 'Draft').length,
    Applied: applications.filter(a => a.status === 'Applied').length,
    'Under Review': applications.filter(a => a.status === 'Under Review').length,
    Accepted: applications.filter(a => a.status === 'Accepted').length,
    Deferred: applications.filter(a => a.status === 'Deferred').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const totalApps = applications.length;

  const removeSavedCol = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSession(prev => ({
      ...prev,
      savedColleges: prev.savedColleges.filter(x => x !== id)
    }));
  };

  const removeSavedCourse = (courseStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSession(prev => ({
      ...prev,
      savedCourses: prev.savedCourses.filter(x => x !== courseStr)
    }));
  };

  return (
    <div id="dashboard-container" className="bg-slate-50/50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Welcome Header Widget */}
        <div id="dashboard-header-widget" className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              <h1 className="font-sans text-2xl font-extrabold sm:text-3xl tracking-tight">
                Welcome back, {session.name || 'Scholar'}!
              </h1>
              <p className="font-sans text-xs text-slate-400">
                Active simulation dashboard for your major in <span className="text-white font-semibold">{session.major}</span>.
              </p>
            </div>
            
            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-8 shrink-0">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase">GPA Score</p>
                <p className="font-mono text-lg font-bold text-white">{session.gpa}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase">SAT Score</p>
                <p className="font-mono text-lg font-bold text-white">{session.sat}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase">ACT Score</p>
                <p className="font-mono text-lg font-bold text-white">{session.act}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column A: Pipeline Application Tracker Quick Summary (Span 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Applications overview card */}
            <div id="widget-applications" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <ListTodo className="h-5 w-5 text-slate-900" />
                  <h2 className="font-sans text-md font-bold text-slate-900">Application Tracking Pipeline</h2>
                </div>
                <button
                  onClick={() => setActivePage('tracker')}
                  className="flex items-center space-x-1 font-bold text-xs text-slate-600 hover:text-slate-900 hover:underline"
                >
                  <span>Go to Kanban</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {totalApps === 0 ? (
                <div className="text-center py-8 bg-slate-50/50 rounded-xl">
                  <p className="text-xs text-slate-500 font-sans">No current applications recorded.</p>
                  <button
                    onClick={() => setActivePage('explore')}
                    className="mt-3 text-xs font-bold text-slate-900 hover:underline"
                  >
                    Select colleges to get started →
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pipeline state grid */}
                  <div className="grid grid-cols-6 gap-2 text-center">
                    {(Object.keys(statusCounts) as Array<keyof typeof statusCounts>).map((status) => (
                      <div key={status} className="rounded-lg bg-slate-50 p-2 border border-slate-100/50">
                        <p className="text-[10px] font-semibold text-slate-500 truncate">{status}</p>
                        <p className="font-mono text-sm font-bold text-slate-900 mt-1">{statusCounts[status]}</p>
                      </div>
                    ))}
                  </div>

                  {/* Horizontal visual progress gauge */}
                  <div>
                    <div className="flex h-3.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="bg-slate-400" style={{ width: `${totalApps ? (statusCounts.Draft / totalApps) * 100 : 0}%` }} title="Drafts" />
                      <div className="bg-slate-500" style={{ width: `${totalApps ? (statusCounts.Applied / totalApps) * 100 : 0}%` }} title="Applied" />
                      <div className="bg-amber-500" style={{ width: `${totalApps ? (statusCounts['Under Review'] / totalApps) * 100 : 0}%` }} title="Under Review" />
                      <div className="bg-emerald-500" style={{ width: `${totalApps ? (statusCounts.Accepted / totalApps) * 100 : 0}%` }} title="Accepted" />
                      <div className="bg-indigo-400" style={{ width: `${totalApps ? (statusCounts.Deferred / totalApps) * 100 : 0}%` }} title="Deferred" />
                      <div className="bg-rose-500" style={{ width: `${totalApps ? (statusCounts.Rejected / totalApps) * 100 : 0}%` }} title="Rejected" />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-2">
                      <span>Pipeline Summary ({totalApps} total applications)</span>
                      <span className="text-emerald-700 font-bold">{statusCounts.Accepted} Accepted slots</span>
                    </div>
                  </div>

                  {/* Quick active applications table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                          <th className="py-2.5">Institution</th>
                          <th className="py-2.5">Program</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5">Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {applications.slice(0, 3).map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-900">{app.collegeName}</td>
                            <td className="py-2.5 text-slate-600">{app.course}</td>
                            <td className="py-2.5">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                                app.status === 'Under Review' ? 'bg-amber-50 text-amber-700' :
                                'bg-slate-100 text-slate-650'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-2.5 font-mono text-slate-500">{app.deadline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Recommendations */}
            <div id="widget-recommendations" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-slate-900" />
                <h2 className="font-sans text-md font-bold text-slate-900">Custom Fit Match Recommendations</h2>
              </div>
              <p className="text-xs text-slate-500 font-sans mb-4">
                Based on your current academic scores (GPA: {session.gpa}, SAT: {session.sat}), you align beautifully with these universities:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map(col => (
                  <div
                    key={col.id}
                    onClick={() => {
                      setSelectedCollegeId(col.id);
                      setActivePage('details');
                    }}
                    className="group cursor-pointer rounded-xl border border-slate-100 p-4 bg-linear-to-b from-slate-50/30 to-white hover:border-slate-350 transition"
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank #{col.ranking}</p>
                    <h4 className="font-sans text-xs font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-slate-700">{col.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{col.location}</p>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 pt-2 border-t border-slate-100 mt-2">
                      <span>Acceptance: {col.acceptanceRate}%</span>
                      <span className="text-slate-900 font-bold hover:underline">Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column B: Bookmark Lists & Predictor Quick Actions (Span 1) */}
          <div className="space-y-8">
            
            {/* Quick Predictor Widget */}
            <div id="widget-predictor-action" className="rounded-2xl border border-slate-100 bg-linear-to-b from-slate-900 to-slate-950 p-6 text-white shadow-xs">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-5 w-5 text-white" />
                <h2 className="font-sans text-sm font-bold">Simulator Panel</h2>
              </div>
              <p className="text-[11px] text-slate-350 leading-relaxed font-sans mb-4">
                Simulate your admission index score against our entire 15+ university database using historical score percentiles.
              </p>
              <button
                onClick={() => setActivePage('predictor')}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-white text-slate-950 py-2.5 text-xs font-bold shadow-xs hover:bg-slate-100 transition"
              >
                <span>Open Predictor Tool</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Saved Universities Widget */}
            <div id="widget-saved-list" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-slate-900 fill-slate-900" />
                  <h2 className="font-sans text-sm font-bold text-slate-900">Saved Colleges ({session.savedColleges.length})</h2>
                </div>
                <button
                  onClick={() => setActivePage('saved')}
                  className="font-bold text-xs text-slate-500 hover:text-slate-900 hover:underline"
                >
                  View All
                </button>
              </div>

              {session.savedColleges.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-sans border border-dashed border-slate-100 rounded-xl">
                  No saved universities yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {session.savedColleges.map((id) => {
                    const col = COLLEGES_DATA.find(x => x.id === id);
                    if (!col) return null;
                    return (
                      <div
                        key={id}
                        onClick={() => {
                          setSelectedCollegeId(id);
                          setActivePage('details');
                        }}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-2.5 hover:bg-slate-50 transition"
                      >
                        <div className="space-y-0.5 truncate">
                          <p className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700">{col.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{col.location} | Rank #{col.ranking}</p>
                        </div>
                        <button
                          onClick={(e) => removeSavedCol(id, e)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Saved Programs/Courses Widget */}
            <div id="widget-saved-courses" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-slate-900" />
                  <h2 className="font-sans text-sm font-bold text-slate-900">Saved Courses ({session.savedCourses.length})</h2>
                </div>
                <button
                  onClick={() => setActivePage('saved')}
                  className="font-bold text-xs text-slate-500 hover:text-slate-900 hover:underline"
                >
                  Manage
                </button>
              </div>

              {session.savedCourses.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-sans border border-dashed border-slate-100 rounded-xl">
                  No saved programs.
                </div>
              ) : (
                <div className="space-y-2">
                  {session.savedCourses.map((courseStr) => (
                    <div
                      key={courseStr}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 bg-slate-50/20"
                    >
                      <div className="space-y-0.5 truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {courseStr.split(' - ')[1]}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {courseStr.split(' - ')[0]}
                        </p>
                      </div>
                      <button
                        onClick={(e) => removeSavedCourse(courseStr, e)}
                        className="p-1 text-slate-450 hover:text-rose-650 hover:bg-rose-50 rounded-lg transition font-bold"
                        title="Delete Course Bookmark"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
