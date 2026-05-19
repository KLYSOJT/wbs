import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, FileText, ChevronLeft, ChevronRight, Filter, BookOpen, Calendar, Sparkles, Database, ArrowUpRight, GraduationCap, School } from 'lucide-react';

const Research = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filters
  const [titleFilter, setTitleFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchResearch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('research')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error('Error fetching research:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  useEffect(() => {
    let result = records;

    if (titleFilter) {
      result = result.filter(r => r.title?.toLowerCase().includes(titleFilter.toLowerCase()));
    }
    if (gradeFilter) {
      result = result.filter(r => r.grade?.toLowerCase() === gradeFilter.toLowerCase());
    }
    if (deptFilter) {
      result = result.filter(r => r.department?.toLowerCase() === deptFilter.toLowerCase());
    }
    if (yearFilter) {
      result = result.filter(r => String(r.year) === yearFilter);
    }
    if (categoryFilter) {
      result = result.filter(r => r.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    setFilteredRecords(result);
    setCurrentPage(1);
  }, [records, titleFilter, gradeFilter, deptFilter, yearFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatLabel = (val) => {
    if (!val) return 'N/A';
    return val.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Cinematic Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Scholarly Achievements
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Research
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Bulletin
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Discovery Panel (Sidebar) */}
          <aside className="lg:col-span-1 space-y-8 sticky top-32">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-100">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-10 h-10 bg-maroon-950 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Filter size={20} />
                 </div>
                 <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                  Discovery Filters
                </h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-maroon-900 uppercase tracking-[0.2em] mb-3">Academic Keyword</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-maroon-800 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Title or Topic..."
                      value={titleFilter}
                      onChange={(e) => setTitleFilter(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-maroon-900 uppercase tracking-[0.2em] mb-3">Grade Level</label>
                  <select 
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="">All Levels</option>
                    {['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                      <option key={g} value={g.toLowerCase().replace(' ', '-')}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-maroon-900 uppercase tracking-[0.2em] mb-3">Department</label>
                  <select 
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="">All Areas</option>
                    {['Science', 'Mathematics', 'English', 'Social-Studies', 'Technology', 'Arts'].map(d => (
                      <option key={d} value={d.toLowerCase()}>{d.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => { setTitleFilter(''); setGradeFilter(''); setDeptFilter(''); setYearFilter(''); setCategoryFilter(''); }}
                  className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-maroon-800 transition-colors border-t border-gray-50 mt-4 italic"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Research Listing */}
          <section className="lg:col-span-3 space-y-12">
            {loading ? (
              <div className="space-y-10">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50/50 animate-pulse rounded-[3rem] border border-gray-100"></div>)}
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-32 bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-xl">
                    <Database size={40} />
                 </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] italic">No scholarly works were found in the digital archive.</p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex items-center justify-between px-8 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">
                  <div className="flex items-center gap-3 italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-maroon-800 animate-pulse"></span>
                    Displaying {filteredRecords.length} Documents
                  </div>
                  <span className="flex items-center gap-2"><Sparkles size={14} className="text-maroon-800" /> Archival Order</span>
                </div>
                
                {paginatedRecords.map((record) => (
                  <article key={record.id} className="group bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/30 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row h-full md:h-[280px]">
                    <div className="md:w-72 bg-gray-50/50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-50 relative overflow-hidden shrink-0">
                      {record.image ? (
                        <img src={record.image} alt={record.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <BookOpen size={64} className="text-maroon-950/5 group-hover:text-maroon-950/10 transition-colors" />
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">RMNS Records</span>
                        </div>
                      )}
                      <div className="absolute top-8 left-8">
                         <span className="bg-maroon-950 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl">
                          {record.category || 'Dissertation'}
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-12 flex flex-col justify-between">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tighter mb-8 leading-tight group-hover:text-maroon-800 transition-colors font-['Playfair_Display'] italic line-clamp-2">
                          {record.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-8">
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <GraduationCap size={16} className="text-maroon-800" /> {formatLabel(record.grade)}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <School size={16} className="text-maroon-800" /> {formatLabel(record.department)}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <Calendar size={16} className="text-maroon-800" /> {record.year}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                        {record.file ? (
                          <a 
                            href={record.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 bg-gray-950 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-maroon-950 transition-all active:scale-95 shadow-xl shadow-gray-950/10 group/btn"
                          >
                            <FileText size={18} className="text-maroon-400" /> Open Full Archive
                            <ArrowUpRight size={14} className="opacity-40 group-hover/btn:opacity-100 transition-all" />
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic flex items-center gap-3">
                             <Database size={16} /> Restricted to Physical Library
                          </span>
                        )}
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-maroon-950 group-hover:bg-maroon-950 group-hover:text-white transition-all duration-500 group-hover:rotate-45">
                          <ChevronRight size={24} />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Modern Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-8 py-10">
                    <button 
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === 1}
                      className="w-14 h-14 rounded-full bg-white border border-gray-100 text-maroon-950 shadow-sm disabled:opacity-20 hover:shadow-2xl hover:border-maroon-800 transition-all flex items-center justify-center group"
                    >
                      <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                       <span className="text-3xl font-bold italic text-maroon-950 font-['Playfair_Display']">{currentPage}</span>
                       <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">of {totalPages}</span>
                    </div>

                    <button 
                      onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === totalPages}
                      className="w-14 h-14 rounded-full bg-white border border-gray-100 text-maroon-950 shadow-sm disabled:opacity-20 hover:shadow-2xl hover:border-maroon-800 transition-all flex items-center justify-center group"
                    >
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Research;
