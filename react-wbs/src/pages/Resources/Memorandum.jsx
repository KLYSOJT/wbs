import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Archive, ArrowDownToLine, Calendar, ChevronLeft, ChevronRight, FileText, Filter, Search } from 'lucide-react';
import HeroWaveBackground from '../../components/HeroWaveBackground';

const Memorandum = ({ tableName, title }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchMemos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error(`Error fetching from ${tableName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, [tableName]);

  const filteredRecords = useMemo(() => {
    let result = records;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((r) => (
        r.title?.toLowerCase().includes(lowerSearch) ||
        r.description?.toLowerCase().includes(lowerSearch)
      ));
    }

    if (selectedYear) result = result.filter((r) => r.date?.startsWith(selectedYear));
    if (selectedMonth) result = result.filter((r) => r.date?.split('-')[1] === selectedMonth);

    return result;
  }, [records, searchTerm, selectedYear, selectedMonth]);

  const years = [...new Set(records.map((r) => r.date?.slice(0, 4)).filter(Boolean))].sort((a, b) => b - a);
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginatedRecords = filteredRecords.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-36 pb-20 text-white">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="user-screen-container relative z-10">
          <div>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <Archive size={15} />
                Official Records Bureau
              </div>

              <h1 className="mt-8 whitespace-nowrap text-[clamp(1.5rem,7.5vw,6rem)] font-bold leading-[0.96] tracking-tight sm:text-[clamp(2.25rem,7.5vw,6rem)]">
                {title}
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                Search, filter, and open official school records from the public archive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="user-screen-container">
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Records Desk</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                Search the {title.toLowerCase()} archive with date controls.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-500 md:text-base">
                Combine keywords, year, and month filters to locate circulars, memoranda, and other official files.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                  <Archive size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">{loading ? '--' : filteredRecords.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Records shown</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <Calendar size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">{years.length || '--'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Archive years</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f0eb] text-gray-950">
                  <FileText size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Files</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Download ready</p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_180px_220px_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  placeholder="Search archival database..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full rounded-2xl border border-gray-100 bg-[#fbfbfa] py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-maroon-800 focus:bg-white focus:ring-4 focus:ring-maroon-50"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-800/50" size={16} />
                <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }} className="w-full rounded-2xl border border-gray-100 bg-[#fbfbfa] py-4 pl-11 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-maroon-50">
                  <option value="">Any Year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-800/50" size={16} />
                <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }} className="w-full rounded-2xl border border-gray-100 bg-[#fbfbfa] py-4 pl-11 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-maroon-50">
                  <option value="">All Months</option>
                  {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              <button type="button" onClick={() => { setSearchTerm(''); setSelectedYear(''); setSelectedMonth(''); setCurrentPage(1); }} className="rounded-2xl border border-gray-100 bg-[#fbfbfa] px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-all hover:border-maroon-800 hover:bg-white hover:text-maroon-800">
                Reset
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-950 text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                    <th className="px-6 py-5">Archive Date</th>
                    <th className="px-6 py-5">Document</th>
                    <th className="hidden px-6 py-5 lg:table-cell">Summary</th>
                    <th className="px-6 py-5 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [1, 2, 3, 4].map((i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="h-24 bg-gray-50/60 px-6 py-8"></td>
                      </tr>
                    ))
                  ) : paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record) => (
                      <tr key={record.id} className="transition-colors hover:bg-maroon-50/30">
                        <td className="whitespace-nowrap px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-950">
                                {record.date ? new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                              </p>
                              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Official Registry</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-sm font-bold leading-6 text-gray-950">{record.title}</p>
                        </td>
                        <td className="hidden px-6 py-6 lg:table-cell">
                          <p className="max-w-md text-sm font-medium leading-6 text-gray-500 line-clamp-2">
                            {record.description || 'Institutional documentation without supplementary archival narrative.'}
                          </p>
                        </td>
                        <td className="px-6 py-6 text-right">
                          {record.file ? (
                            <a href={record.file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-gray-950 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-maroon-800">
                              <FileText size={15} />
                              Open
                              <ArrowDownToLine size={14} />
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Physical Vault</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-24 text-center">
                        <Archive size={40} className="mx-auto mb-5 text-gray-300" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No matching records found in the {title} archives.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col justify-between gap-6 border-t border-gray-100 bg-[#fbfbfa] px-6 py-6 md:flex-row md:items-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Records Displayed: <span className="text-gray-950">{((safeCurrentPage - 1) * pageSize) + 1} - {Math.min(safeCurrentPage * pageSize, filteredRecords.length)}</span> of {filteredRecords.length}
                </p>
                <div className="flex items-center gap-6">
                  <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-maroon-950 shadow-sm ring-1 ring-black/5 disabled:opacity-30">
                    <ChevronLeft size={20} />
                  </button>
                  <p className="text-sm font-bold text-gray-500"><span className="text-xl text-maroon-800">{safeCurrentPage}</span> of {totalPages}</p>
                  <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-maroon-950 shadow-sm ring-1 ring-black/5 disabled:opacity-30">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Memorandum;
