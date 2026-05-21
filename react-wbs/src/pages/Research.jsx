import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, BookOpen, Calendar, ChevronLeft, ChevronRight, Database, FileText, Filter, GraduationCap, School, Search, Sparkles } from 'lucide-react';
import HeroWaveBackground from '../components/HeroWaveBackground';

const Research = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [titleFilter, setTitleFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const pageSize = 10;

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

  const filteredRecords = useMemo(() => {
    let result = records;

    if (titleFilter) {
      result = result.filter((r) => r.title?.toLowerCase().includes(titleFilter.toLowerCase()));
    }
    if (gradeFilter) {
      result = result.filter((r) => r.grade?.toLowerCase() === gradeFilter.toLowerCase());
    }
    if (deptFilter) {
      result = result.filter((r) => r.department?.toLowerCase() === deptFilter.toLowerCase());
    }
    if (yearFilter) {
      result = result.filter((r) => String(r.year) === yearFilter);
    }
    if (categoryFilter) {
      result = result.filter((r) => r.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    return result;
  }, [records, titleFilter, gradeFilter, deptFilter, yearFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginatedRecords = filteredRecords.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const formatLabel = (val) => {
    if (!val) return 'N/A';
    return val.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const clearFilters = () => {
    setTitleFilter('');
    setGradeFilter('');
    setDeptFilter('');
    setYearFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-36 pb-20 text-white">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="user-screen-container relative z-10">
          <div>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <BookOpen size={15} />
                Scholarly Achievements
              </div>

              <h1 className="mt-8 whitespace-nowrap text-[clamp(1.5rem,7.5vw,6rem)] font-bold leading-[0.96] tracking-tight sm:text-[clamp(2.25rem,7.5vw,6rem)]">
                Research Bulletin
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                Browse the school's research archive by title, grade level, department, year, and category.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="user-screen-container">
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Research Finder</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                Narrow the archive by topic, year, level, and strand.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-500 md:text-base">
                Use the filter panel to surface studies quickly, then open available files from the record cards.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                  <Database size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">{loading ? '--' : filteredRecords.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visible records</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <Filter size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">5</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Filter paths</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f0eb] text-gray-950">
                  <FileText size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Open</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Digital files</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 text-white">
                    <Filter size={18} />
                  </div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Discovery Filters</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-maroon-800">Academic Keyword</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        type="text"
                        placeholder="Title or topic"
                        value={titleFilter}
                        onChange={(e) => { setTitleFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full rounded-2xl border border-gray-100 bg-[#fbfbfa] py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-maroon-800 focus:bg-white focus:ring-4 focus:ring-maroon-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-maroon-800">Grade Level</label>
                    <select value={gradeFilter} onChange={(e) => { setGradeFilter(e.target.value); setCurrentPage(1); }} className="w-full rounded-2xl border border-gray-100 bg-[#fbfbfa] px-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-maroon-50">
                      <option value="">All Levels</option>
                      {['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                        <option key={g} value={g.toLowerCase().replace(' ', '-')}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-maroon-800">Department</label>
                    <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }} className="w-full rounded-2xl border border-gray-100 bg-[#fbfbfa] px-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-maroon-50">
                      <option value="">All Areas</option>
                      {['Science', 'Mathematics', 'English', 'Social-Studies', 'Technology', 'Arts'].map((d) => (
                        <option key={d} value={d.toLowerCase()}>{d.replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <button type="button" onClick={clearFilters} className="w-full rounded-full border border-gray-200 px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-all hover:border-maroon-800 hover:text-maroon-800">
                    Clear Filters
                  </button>
                </div>
              </div>
            </aside>

            <section className="space-y-6 lg:col-span-3">
              {loading ? (
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => <div key={i} className="h-56 animate-pulse rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5"></div>)}
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-white py-24 text-center shadow-sm ring-1 ring-black/5">
                  <Database size={40} className="mx-auto mb-5 text-gray-300" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No scholarly works were found in the archive.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col justify-between gap-3 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <span className="h-2 w-2 rounded-full bg-maroon-800"></span>
                      Displaying {filteredRecords.length} Documents
                    </div>
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <Sparkles size={14} className="text-maroon-800" />
                      Archival Order
                    </span>
                  </div>

                  {paginatedRecords.map((record) => (
                    <article key={record.id} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon-950/10">
                      <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
                        <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-[#fbfbfa]">
                          {record.image ? (
                            <img src={record.image} alt={record.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="flex flex-col items-center gap-3 text-gray-300">
                              <BookOpen size={48} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">RMNHS Records</span>
                            </div>
                          )}
                          <span className="absolute left-5 top-5 rounded-full bg-gray-950 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
                            {record.category || 'Research'}
                          </span>
                        </div>

                        <div className="flex flex-col justify-between p-6 md:p-8">
                          <div>
                            <h3 className="text-2xl font-bold leading-tight tracking-tight text-gray-950 transition-colors group-hover:text-maroon-800">
                              {record.title}
                            </h3>
                            <div className="mt-5 flex flex-wrap gap-4">
                              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400"><GraduationCap size={15} className="text-maroon-800" /> {formatLabel(record.grade)}</span>
                              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400"><School size={15} className="text-maroon-800" /> {formatLabel(record.department)}</span>
                              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400"><Calendar size={15} className="text-maroon-800" /> {record.year || 'N/A'}</span>
                            </div>
                          </div>

                          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-gray-100 pt-5 md:flex-row md:items-center">
                            {record.file ? (
                              <a href={record.file} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-3 rounded-full bg-gray-950 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-maroon-800">
                                <FileText size={16} />
                                Open Full Archive
                                <ArrowUpRight size={14} />
                              </a>
                            ) : (
                              <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <Database size={16} />
                                Restricted to Physical Library
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-8 py-8">
                      <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-maroon-950 shadow-sm ring-1 ring-black/5 disabled:opacity-30">
                        <ChevronLeft size={22} />
                      </button>
                      <div className="text-sm font-bold text-gray-500">
                        <span className="text-2xl text-maroon-800">{safeCurrentPage}</span> of {totalPages}
                      </div>
                      <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-maroon-950 shadow-sm ring-1 ring-black/5 disabled:opacity-30">
                        <ChevronRight size={22} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Research;
