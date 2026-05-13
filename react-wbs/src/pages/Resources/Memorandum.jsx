import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, FileText, ChevronLeft, ChevronRight, ExternalLink, Calendar, Filter, Archive } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 py-20 font-roboto">
      <header className="mb-20 text-center">
        <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Official Records Bureau</span>
        <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">{title}</h1>
        <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
      </header>

      {/* Control Center: Search & Filters */}
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 mb-12 flex flex-col xl:flex-row items-center gap-6">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-maroon-800 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search within archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] pl-16 pr-6 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="relative group flex-1 xl:flex-none xl:w-40">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-800 opacity-30" size={16} />
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-maroon-50 outline-none appearance-none cursor-pointer"
            >
              <option value="">Any Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="relative group flex-1 xl:flex-none xl:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-800 opacity-30" size={16} />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-maroon-50 outline-none appearance-none cursor-pointer"
            >
              <option value="">All Months</option>
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          
          <button 
            onClick={() => { setSearchTerm(''); setSelectedYear(''); setSelectedMonth(''); }}
            className="hidden xl:flex w-14 h-14 rounded-2xl bg-gray-50 items-center justify-center text-gray-300 hover:text-maroon-800 transition-all border border-gray-100 hover:bg-maroon-50"
          >
            <Archive size={20} />
          </button>
        </div>
      </div>

      {/* Data Visualization: Table */}
      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-maroon-900 text-white uppercase text-[10px] tracking-[0.3em] italic font-black">
                <th className="px-10 py-8">Release Date</th>
                <th className="px-10 py-8">Document Title</th>
                <th className="px-10 py-8 hidden lg:table-cell">Brief Summary</th>
                <th className="px-10 py-8 text-right">Repository</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-10 py-10 h-24 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : paginatedRecords.length > 0 ? (
                paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-maroon-50/30 transition-all group">
                    <td className="px-10 py-10 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-maroon-800">
                          <Calendar size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-black text-gray-900 italic">
                             {record.date ? new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                           </p>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Official Date</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter leading-snug group-hover:text-maroon-900 transition-colors">
                        {record.title}
                      </p>
                    </td>
                    <td className="px-10 py-10 hidden lg:table-cell">
                      <p className="text-xs font-medium text-gray-500 max-w-sm line-clamp-2 italic leading-relaxed">
                        {record.description || 'No formal description archived for this record.'}
                      </p>
                    </td>
                    <td className="px-10 py-10 text-right">
                      {record.file ? (
                        <a 
                          href={record.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-maroon-900 transition-all active:scale-95 shadow-xl shadow-gray-900/10 group/btn"
                        >
                          <FileText size={16} /> Open Vault
                          <ExternalLink size={14} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Physical Copy Only</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <Archive size={48} className="text-gray-100 mx-auto mb-6" />
                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">The requested records were not found in the current archive.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Global Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50/50 px-10 py-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-maroon-800 rounded-full"></div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                 Showing <span className="text-gray-900">{((currentPage - 1) * pageSize) + 1}</span> — <span className="text-gray-900">{Math.min(currentPage * pageSize, filteredRecords.length)}</span> of {filteredRecords.length} Documents
               </p>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === 1}
                className="w-14 h-14 rounded-full bg-white border border-gray-100 text-maroon-800 disabled:opacity-20 hover:shadow-2xl hover:border-maroon-800 transition-all flex items-center justify-center group"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-3">
                 <span className="text-2xl font-black italic text-maroon-900">{currentPage}</span>
                 <span className="text-[10px] font-black text-gray-300 uppercase">/ {totalPages}</span>
              </div>

              <button 
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === totalPages}
                className="w-14 h-14 rounded-full bg-white border border-gray-100 text-maroon-800 disabled:opacity-20 hover:shadow-2xl hover:border-maroon-800 transition-all flex items-center justify-center group"
              >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Memorandum;
