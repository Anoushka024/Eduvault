import React, { useState } from 'react';
import { 
  ListTodo, 
  Plus, 
  Trash2, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  X,
  FileText,
  Bookmark
} from 'lucide-react';
import { Application, ApplicationStatus, ChecklistItem } from '../types';
import { COLLEGES_DATA } from '../data/colleges';

interface TrackerProps {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  setActivePage: (p: any) => void;
}

export const Tracker: React.FC<TrackerProps> = ({
  applications,
  setApplications,
  setActivePage
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add Form states
  const [addColId, setAddColId] = useState(COLLEGES_DATA[0]?.id || '');
  const [addMajor, setAddMajor] = useState('Computer Science');
  const [addTerm, setAddTerm] = useState('Fall 2026');
  const [addDeadline, setAddDeadline] = useState('1/1/2027');

  const selectedApp = applications.find(a => a.id === selectedAppId);

  // Transition columns
  const handleTransition = (appId: string, direction: 'forward' | 'backward') => {
    const statuses: ApplicationStatus[] = ['Draft', 'Applied', 'Under Review', 'Accepted', 'Deferred', 'Rejected'];
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const currentIndex = statuses.indexOf(app.status);
      let nextIndex = currentIndex;
      if (direction === 'forward' && currentIndex < statuses.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (direction === 'backward' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }
      return { ...app, status: statuses[nextIndex] };
    }));
  };

  const handleUpdateStatus = (appId: string, targetStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return { ...app, status: targetStatus };
    }));
  };

  // Toggle individual checklist checkboxes!
  const toggleChecklist = (appId: string, itemId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const newItems = app.checklist.map(item => {
        if (item.id === itemId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
      return { ...app, checklist: newItems };
    }));
  };

  // Delete an application
  const handleDeleteApp = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplications(prev => prev.filter(a => a.id !== appId));
    if (selectedAppId === appId) {
      setSelectedAppId(null);
    }
  };

  // Create customized checklists for manual application creation
  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenCollege = COLLEGES_DATA.find(c => c.id === addColId);
    if (!chosenCollege) return;

    // Check if duplicate already exists
    const duplicate = applications.some(a => a.collegeId === addColId);
    if (duplicate) {
      alert("Application already registered inside your tracked pipeline.");
      setShowAddForm(false);
      return;
    }

    const defaultChecklist: ChecklistItem[] = [
      { id: '1', text: 'Write Personal Statement Essay & supplement statements', completed: false },
      { id: '2', text: 'Order high school course transcripts', completed: false },
      { id: '3', text: 'Secure Counselor recommendation letter', completed: false },
      { id: '4', text: 'Submit official score logbooks', completed: false }
    ];

    const newApp: Application = {
      id: `app-${addColId}-${Date.now()}`,
      collegeId: addColId,
      collegeName: chosenCollege.name,
      course: addMajor,
      status: 'Draft',
      term: addTerm,
      deadline: addDeadline || 'January 1',
      checklist: defaultChecklist,
      notes: `Targeting admission for ${addMajor}.`
    };

    setApplications(prev => [newApp, ...prev]);
    setShowAddForm(false);
  };

  // Filter columns for visual kanban layout
  const columns: { title: ApplicationStatus; color: string; bg: string }[] = [
    { title: 'Draft', color: 'text-slate-650 bg-slate-100', bg: 'bg-slate-50/50' },
    { title: 'Applied', color: 'text-blue-650 bg-blue-100/50', bg: 'bg-blue-50/10' },
    { title: 'Under Review', color: 'text-amber-650 bg-amber-100/50', bg: 'bg-amber-50/10' },
    { title: 'Accepted', color: 'text-emerald-650 bg-emerald-100/50', bg: 'bg-emerald-50/10' },
    { title: 'Deferred', color: 'text-indigo-650 bg-indigo-100/50', bg: 'bg-indigo-50/10' },
    { title: 'Rejected', color: 'text-rose-650 bg-rose-100/50', bg: 'bg-rose-50/10' }
  ];

  return (
    <div id="tracker-screen" className="bg-slate-50/50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Banner with stats & CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2">
              <ListTodo className="h-7 w-7 text-slate-950" />
              Applications Kanban Tracker
            </h1>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Visualize deadlines, compile checklist credentials, and switch pipeline states seamlessly.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add College Application</span>
          </button>
        </div>

        {/* Visual Kanban Columns Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {columns.map((col) => {
            const colsApps = applications.filter(a => a.status === col.title);
            return (
              <div 
                key={col.title} 
                className={`rounded-2xl border border-slate-100 bg-white p-3 space-y-3 shadow-xs h-full flex flex-col`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-50">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">{colsApps.length}</span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[36rem]">
                  {colsApps.length === 0 ? (
                    <div className="text-center py-8 text-[10px] text-slate-400 font-sans border border-dashed border-slate-100 rounded-xl">
                      Empty Lane
                    </div>
                  ) : (
                    colsApps.map((app) => {
                      const completedCount = app.checklist.filter(c => c.completed).length;
                      const totalCount = app.checklist.length;
                      const percentComplete = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

                      return (
                        <div
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`group cursor-pointer rounded-xl border p-3.5 space-y-3 transition shadow-xs bg-white ${
                            selectedAppId === app.id ? 'border-slate-800 ring-2 ring-slate-100' : 'border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-sans text-xs font-extrabold text-slate-950 line-clamp-1 group-hover:text-slate-700">
                              {app.collegeName}
                            </h4>
                            <p className="font-sans text-[10px] text-slate-500 font-medium truncate">
                              {app.course}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-sans">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                              Deadline: <span className="text-slate-600 font-mono ml-0.5 font-semibold">{app.deadline}</span>
                            </span>
                          </div>

                          {/* Incremental percentage meters */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                              <span>Credentials Check</span>
                              <span>{completedCount}/{totalCount}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-slate-900 transition-all duration-350" style={{ width: `${percentComplete}%` }} />
                            </div>
                          </div>

                          {/* Fast Move and Trash Actions */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-50">
                            <button
                              onClick={(e) => handleDeleteApp(app.id, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Tracker Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleTransition(app.id, 'backward')}
                                className="p-0.5 rounded-md border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                                title="Demote Status"
                              >
                                <ChevronLeft className="h-3 w-3 text-slate-500" />
                              </button>
                              <button
                                onClick={() => handleTransition(app.id, 'forward')}
                                className="p-0.5 rounded-md border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                                title="Promote Status"
                              >
                                <ChevronRight className="h-3 w-3 text-slate-500" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Expanded Sidebar Panel Details */}
        {selectedApp && (
          <div id="expanded-sidebar-panel" className="rounded-3xl border border-slate-150 bg-white p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="md:col-span-1 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Selected Tracker Summary</span>
                <button
                  onClick={() => setSelectedAppId(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <h3 className="font-sans text-lg font-bold text-slate-950 leading-tight">
                {selectedApp.collegeName}
              </h3>
              <p className="font-sans text-xs text-slate-600">
                Application Major: <span className="text-slate-950 font-bold">{selectedApp.course}</span>
              </p>

              <div className="rounded-xl bg-slate-50 p-3 space-y-2 border border-slate-100/50 text-xs">
                <p className="text-slate-500 flex justify-between">
                  <span>Term Session:</span>
                  <span className="font-bold text-slate-900">{selectedApp.term}</span>
                </p>
                <p className="text-slate-500 flex justify-between">
                  <span>Admitted Target Deadline:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedApp.deadline}</span>
                </p>
                
                <div className="pt-2 border-t border-slate-150">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Interactive State Selector</label>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value as ApplicationStatus)}
                    className="w-full mt-1 rounded-lg border border-slate-250 bg-white p-1 text-xs text-slate-800"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Deferred">Deferred</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checklist items list */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Core Admission Credentials Checklist</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3">
                {selectedApp.checklist.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleChecklist(selectedApp.id, item.id)}
                    className={`flex items-start text-left space-x-2.5 rounded-xl border p-3 transition leading-tight ${
                      item.completed 
                        ? 'border-emerald-250 bg-emerald-50/20 text-emerald-950' 
                        : 'border-slate-100 bg-slate-50/10 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="h-4.5 w-4.5 text-slate-300" />
                      )}
                    </span>
                    <span className="text-xs font-medium font-sans">{item.text}</span>
                  </button>
                ))}
              </div>

              {/* Editable Notes textarea */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Personal Log / Notes</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-slate-500 focus:outline-none"
                  rows={2}
                  placeholder="Record credentials usernames, passwords, essay feedback, or interview scheduling information here..."
                  value={selectedApp.notes}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setApplications(prev => prev.map(a => {
                      if (a.id !== selectedApp.id) return a;
                      return { ...a, notes: txt };
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add custom college Application */}
        {showAddForm && (
          <div id="add-app-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                <h3 className="font-sans text-md font-bold text-slate-950">Add University Tracker Item</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target University</label>
                  <select
                    value={addColId}
                    onChange={(e) => setAddColId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
                    required
                  >
                    {COLLEGES_DATA.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Degree Program / Course</label>
                  <input
                    type="text"
                    required
                    value={addMajor}
                    onChange={(e) => setAddMajor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                    placeholder="e.g. Computer Science (B.S.)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Application Term</label>
                    <select
                      value={addTerm}
                      onChange={(e) => setAddTerm(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
                    >
                      <option value="Fall 2026">Fall 2026</option>
                      <option value="Spring 2027">Spring 2027</option>
                      <option value="Fall 2027">Fall 2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Deadline</label>
                    <input
                      type="text"
                      required
                      value={addDeadline}
                      onChange={(e) => setAddDeadline(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                      placeholder="e.g. Jan 1, 2027"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold py-2.5 shadow-sm transition active:scale-[0.99] mt-2 block"
                >
                  Create Tracked Pipeline Card
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
