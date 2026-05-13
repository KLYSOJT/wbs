import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Loader2, 
  Plus, 
  Search,
  Calendar,
  ChevronRight,
  Database,
  Tag,
  Filter,
  CheckCircle2,
  Archive
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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTable, setActiveTable] = useState(categories[0].id);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [activeTable]);

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

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20 font-roboto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Official Documentation</span>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Archives Management</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Publish and catalog official school memoranda and transparency records.</p>
        </div>
        <div className="relative z-10 bg-maroon-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-maroon-900/20 flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Table</p>
              <p className="text-xl font-black italic tracking-tighter truncate w-48">{categories.find(c => c.id === activeTable)?.name}</p>
           </div>
           <Archive size={40} className="text-white/20" />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        {/* Sidebar: Table Selector */}
        <aside className="xl:col-span-1 space-y-8">
           <div className="bg-gray-900 rounded-[3rem] p-8 shadow-2xl shadow-gray-900/40 text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 px-4 flex items-center gap-2">
                 <Filter size={14} /> Repository Filter
              </h3>
              <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar px-2">
                 {categories.map((cat) => (
                   <button
                    key={cat.id}
                    onClick={() => setActiveTable(cat.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTable === cat.id ? 'bg-maroon-600 text-white shadow-xl' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}
                   >
                     <span className="font-black uppercase italic tracking-tighter text-[11px] text-left leading-tight">{cat.name}</span>
                     <ChevronRight size={14} className={`transition-transform shrink-0 ${activeTable === cat.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                   </button>
                 ))}
              </div>
           </div>
        </aside>

        {/* Main: Form & Feed */}
        <div className="xl:col-span-3 space-y-12">
          {/* Publisher Form */}
          <section className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-maroon-50 rounded-2xl flex items-center justify-center text-maroon-800 shadow-sm">
                   <Plus size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Record Publisher</h2>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Publishing to: {activeTable}</p>
                </div>
             </div>

             <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Document Title</label>
                      <input 
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter official title..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Brief Description</label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide short context..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all h-32 resize-none"
                      />
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Publication Date</label>
                      <input 
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Official PDF Asset</label>
                      <label className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-8 cursor-pointer hover:bg-maroon-50 hover:border-maroon-200 transition-all group">
                        <Upload size={32} className="text-gray-300 group-hover:text-maroon-800 transition-colors mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-maroon-900">
                          {file ? file.name : 'Select PDF Document'}
                        </span>
                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                      </label>
                   </div>
                </div>

                <div className="lg:col-span-2 pt-6">
                   <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-6 rounded-[2rem] bg-gray-900 text-white font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl shadow-gray-900/10 hover:bg-maroon-900 active:scale-95 disabled:opacity-30"
                   >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Database size={20} /> Execute Publication</>}
                   </button>
                </div>
             </form>
          </section>

          {/* Records Table */}
          <section className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
             <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">Recent Archives</h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Snapshot of 20 entries</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                         <th className="px-10 py-6">Date</th>
                         <th className="px-10 py-6">Title</th>
                         <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan={3} className="px-10 py-10 h-20"></td></tr>)
                      ) : records.length > 0 ? (
                        records.map(record => (
                          <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                             <td className="px-10 py-8 whitespace-nowrap">
                                <p className="text-xs font-black text-gray-900">{new Date(record.date).toLocaleDateString()}</p>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-sm font-black uppercase italic tracking-tighter text-gray-700 line-clamp-1">{record.title}</p>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="flex items-center justify-end gap-3">
                                   <button 
                                    onClick={() => handleDelete(record.id)}
                                    className="p-3 text-gray-200 hover:text-red-500 transition-colors"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                   <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 hover:text-maroon-800 transition-all">
                                      <ChevronRight size={18} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                           <td colSpan={3} className="px-10 py-20 text-center">
                              <Archive size={48} className="text-gray-100 mx-auto mb-6" />
                              <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">No records in this category.</p>
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
