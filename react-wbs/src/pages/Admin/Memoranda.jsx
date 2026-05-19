import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Loader2, 
  Plus, 
  Calendar,
  ChevronRight,
  Database,
  Archive,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Clock,
  ExternalLink
} from 'lucide-react';

const categories = [
  { id: 'school_memorandum', name: 'School Memorandum' },
  { id: 'division_memorandum', name: 'Division Memorandum' },
  { id: 'deped_memorandum', name: 'DepEd Memorandum' },
  { id: 'deped_order', name: 'DepEd Order' },
  { id: 'app', name: 'Annual Procurement Plan' },
  { id: 'award_of_contracts', name: 'Award of Contracts' },
  { id: 'bac', name: 'Bids and Awards Committee' },
  { id: 'bid_bulletin', name: 'Bid Bulletin' },
  { id: 'invitation_to_bid', name: 'Invitation to Bid' },
  { id: 'philgeps', name: 'PhilGEPS' },
  { id: 'procurement_reports', name: 'Procurement Reports' },
  { id: 'spta', name: 'SPTA' },
  { id: 'sslg', name: 'SSLG' },
  { id: 'bsp', name: 'BSP' },
  { id: 'gsp', name: 'GSP' },
  { id: 'tr', name: 'TR' },
  { id: 'mooe', name: 'MOOE' },
  { id: 'red_cross', name: 'Red Cross' },
];

const AdminMemoranda = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const initialTable = searchParams.get('table');
  const [activeTable, setActiveTable] = useState(
    categories.some((cat) => cat.id === initialTable) ? initialTable : categories[0].id
  );

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [activeTable]);

  useEffect(() => {
    const table = searchParams.get('table');
    if (categories.some((cat) => cat.id === table) && table !== activeTable) {
      setActiveTable(table);
    }
  }, [searchParams, activeTable]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(activeTable)
        .select('*')
        .order('date', { ascending: false })
        .limit(20);
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching records:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let fileUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `memo-${activeTable}-${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from('memoranda-files').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('memoranda-files').getPublicUrl(fileName);
        fileUrl = publicUrl;
      }

      const { error } = await supabase.from(activeTable).insert([{ 
        title, 
        description, 
        date, 
        file: fileUrl,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      setFile(null);
      await fetchRecords();
      alert('Document published successfully!');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await supabase.from(activeTable).delete().eq('id', id);
      await fetchRecords();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveTable(categoryId);
    setSearchParams({ table: categoryId });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20 font-outfit">
      {/* Cinematic Identity Header */}
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="text-maroon-800 font-bold uppercase tracking-[0.5em] text-[10px] bg-maroon-50 px-5 py-2 rounded-full">
                 Official Documentation
               </span>
               <div className="h-px w-12 bg-maroon-100"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic">
              Archives <span className="text-maroon-800">Management</span>
            </h1>
            <p className="text-gray-400 font-medium italic text-lg max-w-2xl">
              Secure archival protocol for official school memoranda, transparency reports, and institutional documentation.
            </p>
          </div>

          <div className="relative bg-maroon-950 px-10 py-8 rounded-[2.5rem] shadow-2xl shadow-maroon-950/20 group/stat hover:bg-black transition-all duration-500 border border-white/5">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-maroon-500 border border-white/10 group-hover/stat:scale-110 transition-transform duration-500">
                   <Archive size={28} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Active Vault</p>
                   <p className="text-xl font-bold text-white tracking-tighter font-['Playfair_Display'] italic truncate w-40">
                    {categories.find(c => c.id === activeTable)?.name}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Sidebar: Repository Selector */}
        <aside className="xl:col-span-3 space-y-8">
          <div className="bg-gray-950 rounded-[4rem] p-10 shadow-2xl shadow-gray-900/40 text-white border border-white/5 overflow-hidden group/nav h-[calc(100vh-200px)] flex flex-col sticky top-32">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/nav:opacity-5 transition-opacity">
               <ShieldCheck size={200} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-10 px-4">
                <div className="w-1.5 h-8 bg-maroon-600 rounded-full"></div>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/30">Repository Filter</h3>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeTable === cat.id ? 'bg-maroon-600 text-white shadow-2xl' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}
                  >
                    <span className="font-bold uppercase tracking-tight text-[11px] text-left leading-tight relative z-10">{cat.name}</span>
                    <div className={`transition-all duration-500 relative z-10 ${activeTable === cat.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                       <ChevronRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Console: Records Management */}
        <div className="xl:col-span-9 space-y-12">
          {/* Secure Publisher Console */}
          <section className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group/form">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/form:opacity-10 transition-opacity">
                <Lock size={150} />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-maroon-50 rounded-3xl flex items-center justify-center text-maroon-800 shadow-xl border border-maroon-100 group-hover/form:rotate-12 transition-transform duration-700">
                     <Plus size={32} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] italic">Secure Publisher</h2>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Target Protocol: {activeTable}</p>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="group/input">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block group-focus-within/input:text-maroon-800 transition-colors">Document Identity</label>
                        <input 
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Official document title..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                        />
                     </div>
                     <div className="group/input">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block group-focus-within/input:text-maroon-800 transition-colors">Contextual Summary</label>
                        <textarea 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Brief abstract of the record..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all h-40 resize-none placeholder:text-gray-300"
                        />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="group/input">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block group-focus-within/input:text-maroon-800 transition-colors">Execution Date</label>
                        <input 
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all"
                        />
                     </div>
                     <div className="group/upload">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Official Document Asset (PDF)</label>
                        <label className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] p-12 cursor-pointer hover:bg-maroon-50 hover:border-maroon-200 transition-all duration-700 group/label relative overflow-hidden h-40">
                          <Upload size={40} className="text-gray-300 group-hover/label:text-maroon-800 transition-all duration-700 mb-4 group-hover/label:-translate-y-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/label:text-maroon-950 transition-colors text-center px-8 truncate w-full">
                            {file ? file.name : 'Select Secure PDF Asset'}
                          </span>
                          <input type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                     </div>
                  </div>

                  <div className="lg:col-span-2 pt-4">
                     <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full py-6 rounded-full bg-maroon-950 text-white font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl shadow-maroon-950/20 hover:bg-black active:scale-95 disabled:opacity-20 group/submit"
                     >
                      {submitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Database size={20} className="text-maroon-500" /> 
                          Commit to Institutional Archive
                          <ArrowUpRight size={18} className="opacity-40 group-hover/submit:opacity-100 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-all" />
                        </>
                      )}
                     </button>
                  </div>
               </form>
             </div>
          </section>

          {/* Archival Log Stream */}
          <section className="bg-white rounded-[4rem] shadow-2xl shadow-gray-200/40 border border-gray-50 overflow-hidden group/table">
             <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                   <Clock size={100} />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-1.5 h-8 bg-gray-900 rounded-full"></div>
                   <h3 className="text-3xl font-bold tracking-tighter text-gray-900 font-['Playfair_Display'] italic">Recent Archives</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] relative z-10">Archival Registry v4.2</span>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">
                         <th className="px-12 py-8">Registry Date</th>
                         <th className="px-12 py-8">Document Identity</th>
                         <th className="px-12 py-8 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan={3} className="px-12 py-12 h-28"></td></tr>)
                      ) : records.length > 0 ? (
                        records.map(record => (
                          <tr key={record.id} className="hover:bg-gray-50 transition-all duration-500 group/row">
                             <td className="px-12 py-10 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                   <Calendar size={16} className="text-maroon-800/40 group-hover/row:text-maroon-800 transition-colors" />
                                   <p className="text-xs font-bold text-gray-900">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                             </td>
                             <td className="px-12 py-10">
                                <div className="min-w-0">
                                   <p className="text-lg font-bold text-gray-700 tracking-tight group-hover:text-black transition-colors font-['Playfair_Display'] italic line-clamp-1">{record.title}</p>
                                   <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Document Registry ID: {record.id.slice(0, 8)}</p>
                                </div>
                             </td>
                             <td className="px-12 py-10 text-right">
                                <div className="flex items-center justify-end gap-4">
                                   <button 
                                    onClick={() => handleDelete(record.id)}
                                    className="w-12 h-12 rounded-2xl bg-white text-gray-300 hover:text-red-600 hover:shadow-2xl transition-all duration-500 border border-gray-100 flex items-center justify-center group/del"
                                   >
                                      <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                                   </button>
                                   <a 
                                    href={record.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-gray-950 text-white flex items-center justify-center hover:bg-maroon-950 transition-all duration-500 shadow-xl shadow-gray-950/20 group/view"
                                   >
                                      <ExternalLink size={20} className="group-hover/view:scale-110 transition-transform" />
                                   </a>
                                </div>
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                           <td colSpan={3} className="px-12 py-32 text-center">
                              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-100 shadow-xl border border-gray-50">
                                 <Archive size={48} />
                              </div>
                              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest italic">The archival registry for this category is currently empty.</p>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminMemoranda;
