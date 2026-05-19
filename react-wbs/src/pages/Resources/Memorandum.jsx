import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, FileText, ChevronLeft, ChevronRight, Calendar, Filter, Archive, ArrowDownToLine } from 'lucide-react';

const Memorandum = ({ tableName, title }) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
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

  useEffect(() => {
    let result = records;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(r => 
        (r.title?.toLowerCase().includes(lowerSearch)) ||
        (r.description?.toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedYear) {
      result = result.filter(r => r.date?.startsWith(selectedYear));
    }

    if (selectedMonth) {
      result = result.filter(r => r.date?.split('-')[1] === selectedMonth);
    }

    setFilteredRecords(result);
    setCurrentPage(1);
  }, [records, searchTerm, selectedYear, selectedMonth]);

  const years = [...new Set(records.map(r => r.date?.slice(0, 4)).filter(Boolean))].sort((a, b) => b - a);
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Official Records Bureau
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                {title.split(' ')[0]}
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                {title.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-32">
        {/* Modern Control Center */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-100 mb-12 flex flex-col xl:flex-row items-center gap-6">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-maroon-800 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search archival database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] pl-16 pr-6 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-40 group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-800 opacity-40 group-hover:opacity-100 transition-opacity" size={16} />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-maroon-50 outline-none appearance-none cursor-pointer hover:bg-white transition-all"
              >
                <option value="">Any Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="relative flex-1 xl:w-48 group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-800 opacity-40 group-hover:opacity-100 transition-opacity" size={16} />
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-maroon-50 outline-none appearance-none cursor-pointer hover:bg-white transition-all"
              >
                <option value="">All Months</option>
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            
            <button 
              onClick={() => { setSearchTerm(''); setSelectedYear(''); setSelectedMonth(''); }}
              className="hidden xl:flex w-14 h-14 rounded-2xl bg-gray-50/50 items-center justify-center text-gray-300 hover:text-maroon-800 transition-all border border-gray-100 hover:bg-white hover:shadow-lg"
            >
              <Archive size={20} />
            </button>
          </div>
        </div>

        {/* Premium Data Table */}
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900 text-white uppercase text-[10px] tracking-[0.4em] font-bold">
                  <th className="px-12 py-10">Archive Date</th>
                  <th className="px-12 py-10">Document Specification</th>
                  <th className="px-12 py-10 hidden lg:table-cell">Narrative Summary</th>
                  <th className="px-12 py-10 text-right">Access Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-outfit">
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-12 py-12 h-24 bg-gray-50/20"></td>
                    </tr>
                  ))
                ) : paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-maroon-50/30 transition-all group">
                      <td className="px-12 py-10 whitespace-nowrap">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-maroon-950 group-hover:bg-maroon-950 group-hover:text-white transition-all duration-500">
                            <Calendar size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-900 leading-none">
                               {record.date ? new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                             </p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Official Registry</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <p className="text-sm font-bold text-gray-900 tracking-tight leading-snug group-hover:text-maroon-800 transition-colors font-['Playfair_Display'] italic">
                          {record.title}
                        </p>
                      </td>
                      <td className="px-12 py-10 hidden lg:table-cell">
                        <p className="text-xs font-medium text-gray-500 max-w-sm line-clamp-2 leading-relaxed">
                          {record.description || 'Institutional documentation without supplementary archival narrative.'}
                        </p>
                      </td>
                      <td className="px-12 py-10 text-right">
                        {record.file ? (
                          <a 
                            href={record.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-gray-950 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-maroon-950 transition-all active:scale-95 shadow-xl shadow-gray-900/10 group/btn"
                          >
                            <FileText size={16} className="text-maroon-400" /> Secure Link
                            <ArrowDownToLine size={14} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Physical Vault</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-12 py-40 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <Archive size={40} />
                      </div>
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-widest italic">No matching records found in the {title} archives.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Premium Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50/50 px-12 py-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-maroon-800 rounded-full"></div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                   Records Displayed: <span className="text-gray-900">{((currentPage - 1) * pageSize) + 1} — {Math.min(currentPage * pageSize, filteredRecords.length)}</span> of {filteredRecords.length}
                 </p>
              </div>
              
              <div className="flex items-center gap-8">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Memorandum;

