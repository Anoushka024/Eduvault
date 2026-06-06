import { useState } from 'react';
import { ActivePage, UserSession, Application, PredictionRecord } from './types';
import { COLLEGES_DATA } from './data/colleges';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Explorer } from './components/Explorer';
import { Details } from './components/Details';
import { Tracker } from './components/Tracker';
import { Compare } from './components/Compare';
import { SavedCollegesCourses } from './components/SavedCollegesCourses';
import { Predictor } from './components/Predictor';

export default function App() {
  // Navigation states
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('harvard');

  // Unified Session Cache (preloads with guest metrics)
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false, // will ask student to login / click 1-click profiles
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    gpa: 3.96,
    sat: 1530,
    act: 35,
    major: 'Computer Science',
    savedColleges: ['harvard', 'berkeley', 'gatech'],
    savedCourses: [
      'Harvard University - Computer Science',
      'University of California, Berkeley - Electrical Engineering & Computer Science (EECS)'
    ]
  });

  // Default pre-populated draft applications inside Kanban tracker
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app-berkeley-initial',
      collegeId: 'berkeley',
      collegeName: 'University of California, Berkeley',
      course: 'Electrical Engineering & Computer Science (EECS)',
      status: 'Under Review',
      term: 'Fall 2026',
      deadline: 'Nov 30',
      checklist: [
        { id: '1', text: 'Draft Personal Statement & prompts Essay', completed: true },
        { id: '2', text: 'Request Official Transcripts from High School Counselor', completed: true },
        { id: '3', text: 'Secure Two Letters of Recommendation (STEM/Humanities)', completed: false },
        { id: '4', text: 'Submitting standardized SAT/ACT Score logs', completed: false }
      ],
      notes: "Awaiting final counselor transcripts transmission."
    },
    {
      id: 'app-oxford-initial',
      collegeId: 'oxford',
      collegeName: 'University of Oxford',
      course: 'Philosophy, Politics & Economics (PPE)',
      status: 'Applied',
      term: 'Fall 2026',
      deadline: 'Oct 15',
      checklist: [
        { id: '1', text: 'Direct UCAS Entry Form submission', completed: true },
        { id: '2', text: 'Complete Oxford Admission Test logbook', completed: true },
        { id: '3', text: 'Upload academic writing portfolio samples', completed: true },
        { id: '4', text: 'Secure teacher recommendation reference letter', completed: true }
      ],
      notes: "UCAS application completely compiled and paid. Invites for interview slated for mid December."
    }
  ]);

  // Simulation prediction history logbooks
  const [history, setHistory] = useState<PredictionRecord[]>([
    {
      id: 'pred-initial-1',
      timestamp: '02:40 PM 10/12/2026',
      input: {
        gpa: 3.96,
        sat: 1530,
        act: 35,
        extracurriculars: 4,
        apCount: 8,
        major: 'Computer Science',
        state: 'MA'
      },
      results: {} // Hydrated dynamically when loaded if needed
    },
    {
      id: 'pred-initial-2',
      timestamp: '11:15 AM 10/05/2026',
      input: {
        gpa: 3.75,
        sat: 1410,
        act: 31,
        extracurriculars: 3,
        apCount: 5,
        major: 'Economics',
        state: 'CA'
      },
      results: {}
    }
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans tracking-tight">
      {/* Universal Sticky Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        session={session} 
        setSession={setSession} 
      />

      {/* Dynamic Content Routers */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home 
            setActivePage={setActivePage} 
            setSelectedCollegeId={setSelectedCollegeId}
            session={session}
            setSession={setSession}
          />
        )}

        {activePage === 'auth' && (
          <Auth 
            setSession={setSession} 
            setActivePage={setActivePage} 
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            session={session}
            setSession={setSession}
            setActivePage={setActivePage}
            setSelectedCollegeId={setSelectedCollegeId}
            applications={applications}
            history={history}
          />
        )}

        {activePage === 'explore' && (
          <Explorer
            setActivePage={setActivePage}
            setSelectedCollegeId={setSelectedCollegeId}
            session={session}
            setSession={setSession}
          />
        )}

        {activePage === 'details' && (
          <Details
            collegeId={selectedCollegeId}
            setActivePage={setActivePage}
            session={session}
            setSession={setSession}
            applications={applications}
            setApplications={setApplications}
          />
        )}

        {activePage === 'tracker' && (
          <Tracker
            applications={applications}
            setApplications={setApplications}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'compare' && (
          <Compare
            session={session}
            setSession={setSession}
            setActivePage={setActivePage}
            setSelectedCollegeId={setSelectedCollegeId}
          />
        )}

        {activePage === 'saved' && (
          <SavedCollegesCourses
            session={session}
            setSession={setSession}
            setActivePage={setActivePage}
            setSelectedCollegeId={setSelectedCollegeId}
          />
        )}

        {/* Dynamic unified predictor router handles results and histories internally */}
        {(activePage === 'predictor' || activePage === 'predictor-results' || activePage === 'predictor-history') && (
          <Predictor
            session={session}
            setSession={setSession}
            history={history}
            setHistory={setHistory}
            activePage={activePage}
            setActivePage={setActivePage}
            setSelectedCollegeId={setSelectedCollegeId}
          />
        )}
      </main>

      {/* Universal Footer section */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
