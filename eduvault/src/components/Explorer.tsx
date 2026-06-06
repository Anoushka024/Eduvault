import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Star, 
  ChevronRight, 
  ArrowUpDown,
  BookOpen,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { COLLEGES_DATA } from '../data/colleges';
import { ActivePage, College, UserSession } from '../types';

interface ExplorerProps {
  setActivePage: (p: ActivePage) => void;
  setSelectedCollegeId: (id: string) => void;
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
}

export const Explorer: React.FC<ExplorerProps> = ({
  setActivePage,
  setSelectedCollegeId,
  session,
  setSession
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [maxTuition, setMaxTuition] = useState('70000');
  const [maxAcceptance, setMaxAcceptance] = useState('100');
  const [selectedMajor, setSelectedMajor] = useState('All');
  const [sortBy, setSortBy] = useState<'ranking' | 'acceptanceRate' | 'tuition'>('ranking');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [showFilters, setShowFilters] = useState(false);

  // Extract list of unique majors and countries for the filter dropdowns dynamically!
  const uniqueMajors = useMemo(() => {
    const majors = new Set<string>();
    COLLEGES_DATA.forEach(col => col.majors.forEach(m => majors.add(m)));
    return ['All', ...Array.from(majors)];
  }, []);

  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    COLLEGES_DATA.forEach(col => countries.add(col.country));
    return ['All', ...Array.from(countries)];
  }, []);

  // Filter & Sort Logic
  const filteredColleges = useMemo(() => {
    let result = [...COLLEGES_DATA];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(col => 
        col.name.toLowerCase().includes(query) || 
        col.location.toLowerCase().includes(query)
      );
    }

    // Country filter
    if (countryFilter !== 'All') {
      result = result.filter(col => col.country === countryFilter);
    }

    // Major filter
    if (selectedMajor !== 'All') {
      result = result.filter(col => col.majors.includes(selectedMajor));
    }

    // Max Tuition filter
    if (maxTuition) {
      result = result.filter(col => col.tuition <= parseInt(maxTuition));
    }

    // Max Acceptance filter
    if (maxAcceptance) {
      result = result.filter(col => col.acceptanceRate <= parseInt(maxAcceptance));
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [searchQuery, countryFilter, selectedMajor, maxTuition, maxAcceptance, sortBy, sortOrder]);

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
      return { ...prev, savedColleges: newSaved };
    });
  };

  const handleCardClick = (id: string) => {
    setSelectedCollegeId(id);
    setActivePage('details');
  };

  const toggleSort = (field: 'ranking' | 'acceptanceRate' | 'tuition') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      // default ranks / acceptance or fees to logical directions
      setSortOrder(field === 'ranking' ? 'asc' : 'asc');
    }
  };

  return (
    <div id="explorer-container" className="bg-slate-50/50 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Page Titles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Explore Universities Directory
            </h1>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Search and filter across {COLLEGES_DATA.length} premium academic institutions worldwide.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                showFilters 
                  ? 'border-slate-800 bg-slate-900 text-white' 
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-350'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{showFilters ? 'Hide Fine Filters' : 'Fine Tune Filters'}</span>
            </button>

            <button
              onClick={() => setActivePage('compare')}
              className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-350 transition"
            >
              <span>Side-by-Side Compare Tool</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Search & Main Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="md:col-span-2 relative flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-450 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by college name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-900 border-0 bg-transparent focus:outline-none"
            />
          </div>

          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-slate-350 focus:outline-none"
            >
              <option value="All">All Regions / Countries</option>
              {uniqueCountries.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-slate-350 focus:outline-none"
            >
              <option value="All">All Academic Majors</option>
              {uniqueMajors.filter(m => m !== 'All').map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Collapsible Advanced Filters Section */}
        {showFilters && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {/* Max Tuition Sliders */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Maximum Yearly Tuition fee</span>
                <span className="font-mono text-slate-900">${parseInt(maxTuition).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="70000"
                step="2500"
                value={maxTuition}
                onChange={(e) => setMaxTuition(e.target.value)}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>$10,000</span>
                <span>$70,000</span>
              </div>
            </div>

            {/* Acceptance Cap Sliders */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Maximum Acceptance Rate Cap</span>
                <span className="font-mono text-slate-900">{maxAcceptance}%</span>
              </div>
              <input
                type="range"
                min="3"
                max="100"
                step="1"
                value={maxAcceptance}
                onChange={(e) => setMaxAcceptance(e.target.value)}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>3% (Exclusive)</span>
                <span>100% (Open)</span>
              </div>
            </div>

            {/* Quick Reset Form Buttons */}
            <div className="flex items-end justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCountryFilter('All');
                  setMaxTuition('70000');
                  setMaxAcceptance('100');
                  setSelectedMajor('All');
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Sort Controls & Count Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
          <p className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900 font-extrabold">{filteredColleges.length}</span> colleges match query
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Sort by:</span>
            
            <button
              onClick={() => toggleSort('ranking')}
              className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                sortBy === 'ranking' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span>Global Rank</span>
              {sortBy === 'ranking' && <ArrowUpDown className="h-3 w-3 ml-0.5" />}
            </button>

            <button
              onClick={() => toggleSort('acceptanceRate')}
              className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                sortBy === 'acceptanceRate' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span>Acceptance Rate</span>
              {sortBy === 'acceptanceRate' && <ArrowUpDown className="h-3 w-3 ml-0.5" />}
            </button>

            <button
              onClick={() => toggleSort('tuition')}
              className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                sortBy === 'tuition' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span>Tuition Cost</span>
              {sortBy === 'tuition' && <ArrowUpDown className="h-3 w-3 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Colleges Grid */}
        {filteredColleges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs">
            <SlidersHorizontal className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
            <p className="font-sans text-sm font-bold text-slate-900">No universities match details</p>
            <p className="text-xs text-slate-500 font-sans mt-1">Try resetting slider thresholds or clearing your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredColleges.map((col) => {
              const isSaved = session.savedColleges.includes(col.id);
              return (
                <div
                  key={col.id}
                  onClick={() => handleCardClick(col.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-150">
                      <img
                        src={col.image}
                        alt={col.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 to-transparent" />
                      
                      {/* Rank sticker */}
                      <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        Rank #{col.ranking}
                      </span>

                      {/* Bookmark icon toggle */}
                      <button
                        onClick={(e) => toggleSaveCol(col.id, e)}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 hover:text-slate-950 transition shadow-sm"
                      >
                        <Star className={`h-4 w-4 ${isSaved ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                      </button>
                    </div>

                    {/* Meta Section */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{col.location}</span>
                      </div>
                      
                      <h3 className="font-sans text-md font-bold text-slate-950 tracking-tight leading-tight group-hover:text-slate-700 transition">
                        {col.name}
                      </h3>

                      <p className="text-xs text-slate-550 line-clamp-2 leading-relaxed">
                        {col.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing/Rate Details Row */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-50 space-y-3 mt-auto">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Acceptance</p>
                        <p className="font-mono text-xs font-extrabold text-slate-950 mt-0.5">{col.acceptanceRate}%</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Yearly Cost</p>
                        <p className="font-mono text-xs font-extrabold text-slate-950 mt-0.5">${(col.tuition/1000).toFixed(0)}k</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Min GPA</p>
                        <p className="font-mono text-xs font-extrabold text-slate-950 mt-0.5">{col.avgGPA}</p>
                      </div>
                    </div>

                    {/* View Details CTA */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:underline pt-2">
                      <span className="text-[10px] text-slate-400 flex items-center">
                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                        {col.majors.length} majors
                      </span>
                      <span className="flex items-center space-x-0.5">
                        <span>Admissions Details</span>
                        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
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
