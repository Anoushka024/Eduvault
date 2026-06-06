import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Bookmark, 
  Calculator, 
  ListTodo, 
  Compass,
  Star
} from 'lucide-react';
import { COLLEGES_DATA } from '../data/colleges';
import { ActivePage, UserSession } from '../types';

interface HomeProps {
  setActivePage: (p: ActivePage) => void;
  setSelectedCollegeId: (id: string) => void;
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
}

export const Home: React.FC<HomeProps> = ({ 
  setActivePage, 
  setSelectedCollegeId,
  session,
  setSession 
}) => {
  const [searchVal, setSearchVal] = useState('');

  // Handle hero search
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      // Carry search over to explore page
      setActivePage('explore');
    }
  };

  const featuredColleges = COLLEGES_DATA.slice(0, 4);

  const toggleSaveCol = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session.isLoggedIn) {
      setActivePage('auth');
      return;
    }
    setSession(prev => {
      const isSaved = prev.savedColleges.includes(id);
      const newSaved = isSaved 
        ? prev.savedColleges.filter(x => x !== id) 
        : [...prev.savedColleges, id];
      return {
        ...prev,
        savedColleges: newSaved
      };
    });
  };

  return (
    <div id="landing-container" className="bg-white min-h-[calc(100vh-4rem)]">
      
      {/* Hero Section */}
      <section id="hero-section" className="relative border-b border-slate-100 bg-slate-50/40 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract design blobs */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/30 blur-[120px]" />
        
        <div className="mx-auto max-w-4xl text-center space-y-8">
          
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            Empowering modern high-school scholars globally
          </span>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-tight">
            Edu<span className="text-slate-500">Vault</span> College Search & Predictor Portal
          </h1>
          
          <p className="font-sans text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Register academic requirements, simulate acceptance rates with our premium predictive engine, and track application documents securely.
          </p>

          {/* Quick Hero Search Form */}
          <form onSubmit={handleHeroSearch} className="mx-auto max-w-2xl">
            <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-lg transition-focus-within focus-within:border-slate-400">
              <Search className="h-5 w-5 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Search colleges by name (e.g. Stanford, MIT, Oxford...)"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition shrink-0"
              >
                Search Directory
              </button>
            </div>
          </form>

          {/* Direct Tools Quick-links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActivePage('predictor')}
              className="flex items-center space-x-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 border border-slate-200 hover:bg-slate-100/80 transition"
            >
              <Calculator className="h-4 w-4 text-slate-600" />
              <span>Simulate Admission Chances</span>
            </button>
            <button
              onClick={() => setActivePage('compare')}
              className="flex items-center space-x-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 border border-slate-200 hover:bg-slate-100/80 transition"
            >
              <Compass className="h-4 w-4 text-slate-600" />
              <span>Verify Side-by-Side Rank</span>
            </button>
          </div>

        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features-bento" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center md:mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500">Continuous Support Pipeline</p>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-950 mt-2">
            Full Suite Admissions Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          
          {/* Card 1: Directory */}
          <div className="relative rounded-3xl border border-slate-100 bg-linear-to-b from-slate-50/50 to-white p-8 space-y-4 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-slate-950">1. Browse Elite Ranks</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Search through comprehensive college indices. Filter list profiles by average test scores, location, tuition cost, and specific academic majors.
            </p>
          </div>

          {/* Card 2: Predictor */}
          <div className="relative rounded-3xl border border-slate-100 bg-linear-to-b from-slate-50/50 to-white p-8 space-y-4 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-slate-950">2. Predict Score Weights</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Enter target GPAs, SAT scores, and counts of AP coursework. Calculate precise admission ranges classified into Safety, Target, and ambitious Reach slots.
            </p>
          </div>

          {/* Card 3: Tracker */}
          <div className="relative rounded-3xl border border-slate-100 bg-linear-to-b from-slate-50/50 to-white p-8 space-y-4 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
              <ListTodo className="h-6 w-6" />
            </div>
            <h3 className="font-sans text-lg font-bold text-slate-950">3. Monitor Deadlines</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Log essays, secure recommendations, manage transcript request workflows, and track official decision timelines inside a Kanban application pipeline.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Universities Display Grid */}
      <section id="featured-colleges" className="border-t border-slate-100 bg-slate-50/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-500">Premier Global Hubs</p>
              <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950 mt-1">Explore Featured Colleges</h2>
            </div>
            <button
              onClick={() => setActivePage('explore')}
              className="flex items-center space-x-1 text-slate-900 font-bold text-xs hover:underline mt-2 sm:mt-0"
            >
              <span>View All 15 Universities</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredColleges.map((col) => {
              const isSaved = session.savedColleges.includes(col.id);
              return (
                <div
                  key={col.id}
                  onClick={() => {
                    setSelectedCollegeId(col.id);
                    setActivePage('details');
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs hover:-translate-y-1 hover:shadow-md transition duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 overflow-hidden bg-slate-150">
                    <img
                      src={col.image}
                      alt={col.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                    
                    {/* Rank Badge */}
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                      Rank #{col.ranking}
                    </span>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => toggleSaveCol(col.id, e)}
                      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-700 hover:text-slate-950 transition shadow-xs"
                    >
                      <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="p-4 space-y-2">
                    <p className="font-sans text-xs text-slate-500 tracking-tight">{col.location}</p>
                    <h3 className="font-sans text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700 transition">
                      {col.name}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-2 text-[11px] font-semibold text-slate-500">
                      <div>
                        Acceptance: <span className="font-mono text-slate-900 block">{col.acceptanceRate}%</span>
                      </div>
                      <div>
                        Avg SAT: <span className="font-mono text-slate-900 block">{col.avgSAT}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};
