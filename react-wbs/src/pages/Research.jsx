import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, FileText, ChevronLeft, ChevronRight, Filter, BookOpen, User, Calendar, Tag, Sparkles, Database } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 py-20 font-roboto">
      <header className="mb-20 text-center">
        <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Scholarly Achievements</span>
        <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Research Bulletin</h1>
        <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Search Sidebar */}
        <aside className="lg:col-span-1 space-y-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 sticky top-32 transition-all hover:shadow-maroon-900/5">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <Filter size={16} className="text-maroon-800" /> Database Filters
            </h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-maroon-900 uppercase tracking-[0.2em] mb-3">Keyword Search</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-maroon-800 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Enter research title..."
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-maroon-900 uppercase tracking-[0.2em] mb-3">Academic Grade</label>
                <select 
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="">All Grade Levels</option>
                  <option value="grade-7">Grade 7</option>
                  <option value="grade-8">Grade 8</option>
                  <option value="grade-9">Grade 9</option>
                  <option value="grade-10">Grade 10</option>
                  <option value="grade-11">Grade 11</option>
                  <option value="grade-12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-maroon-900 uppercase tracking-[0.2em] mb-3">Departmental Unit</label>
                <select 
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="">All Departments</option>
                  <option value="science">Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English</option>
                  <option value="social-studies">Social Studies</option>
                  <option value="technology">Technology</option>
                  <option value="arts">Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-maroon-900 uppercase tracking-[0.2em] mb-3">Fiscal Year</label>
                <select 
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="">Any Publication Year</option>
                  {[2026, 2025, 2024, 2023, 2022, 2021].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <button 
                onClick={() => {
                  setTitleFilter(''); setGradeFilter(''); setDeptFilter(''); setYearFilter(''); setCategoryFilter('');
                }}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-maroon-800 transition-colors border-t border-gray-50 mt-4"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Research Items */}
        <section className="lg:col-span-3 space-y-12">
          {loading ? (
            <div className="space-y-10">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[3rem]"></div>)}
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
               <Database size={48} className="text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No matching scholarly works were found in the archive.</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center justify-between px-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                <span>Showing {paginatedRecords.length} of {filteredRecords.length} Documents</span>
                <span className="flex items-center gap-2"><Sparkles size={12} className="text-maroon-800" /> Newest First</span>
              </div>
              
              {paginatedRecords.map((record) => (
                <article key={record.id} className="group bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-50 hover:shadow-maroon-900/5 hover:-translate-y-2 transition-all flex flex-col md:flex-row h-full md:h-72">
                  <div className="md:w-64 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative overflow-hidden shrink-0">
                    {record.image ? (
                      <img src={record.image} alt={record.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <BookOpen size={48} className="text-maroon-900/10 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-maroon-900/20 uppercase tracking-widest">RMNS Archives</span>
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                       <span className="bg-maroon-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                        {record.category || 'Paper'}
                       </span>
                    </div>
                  </div>
                  <div className="flex-1 p-10 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 leading-tight group-hover:text-maroon-800 transition-colors line-clamp-2">
                        {record.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <Tag size={16} className="text-maroon-800 opacity-50" /> {formatLabel(record.grade)}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <User size={16} className="text-maroon-800 opacity-50" /> {formatLabel(record.department)}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <Calendar size={16} className="text-maroon-800 opacity-50" /> {record.year}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                      {record.file ? (
                        <a 
                          href={record.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-4 bg-gray-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-maroon-900 transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                        >
                          <FileText size={16} /> Download Full Text
                        </a>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic flex items-center gap-2">
                           <Database size={14} /> Physical Copy Only
                        </span>
                      )}
                      <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-maroon-800 hover:border-maroon-800 transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-20 pb-10">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-14 h-14 rounded-full bg-white border border-gray-100 text-maroon-800 disabled:opacity-20 hover:shadow-2xl hover:border-maroon-800 transition-all flex items-center justify-center"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Catalog Page</span>
                    <span className="text-2xl font-black italic text-maroon-900">{currentPage}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">of {totalPages}</span>
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-14 h-14 rounded-full bg-white border border-gray-100 text-maroon-800 disabled:opacity-20 hover:shadow-2xl hover:border-maroon-800 transition-all flex items-center justify-center"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Research;
