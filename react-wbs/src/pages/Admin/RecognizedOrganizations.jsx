import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  ImageIcon, 
  Loader2, 
  Plus, 
  CheckCircle2, 
  Search,
  Filter,
  Users,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const AdminRecognizedOrgs = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [orgName, setOrgName] = useState('');
  const [adviserName, setAdviserName] = useState('');
  const [dateEstablished, setDateEstablished] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [chartFile, setChartFile] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recognized-structure')
        .select('*')
        .order('created_at', { ascending: false });
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, bucket) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${bucket}-${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const logoUrl = await handleUpload(logoFile, 'org-logos');
      const chartUrl = await handleUpload(chartFile, 'org-charts');

      const payload = {
        org_name: orgName,
        adviser_name: adviserName,
        date_established: dateEstablished,
        created_at: new Date().toISOString()
      };

      if (logoUrl) payload.logo_url = logoUrl;
      if (chartUrl) payload.chart_url = chartUrl;

      const { error } = await supabase.from('recognized-structure').insert([payload]);
      if (error) throw error;

      setOrgName('');
      setAdviserName('');
      setDateEstablished('');
      setLogoFile(null);
      setChartFile(null);
      await fetchRecords();
      alert('Organization added successfully!');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this organization record?')) return;
    try {
      await supabase.from('recognized-structure').delete().eq('id', id);
      await fetchRecords();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Student Affairs Unit</span>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Recognized Organizations</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Manage the digital registry of official school organizations.</p>
        </div>
        <div className="relative z-10 bg-maroon-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-maroon-900/20 flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Units</p>
              <p className="text-3xl font-black italic tracking-tighter">{records.length}</p>
           </div>
           <Users size={40} className="text-white/20" />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Creator Sidebar */}
        <div className="xl:col-span-1">
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-[3.5rem] p-10 shadow-2xl shadow-gray-900/40 text-white sticky top-12">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-maroon-600 rounded-2xl flex items-center justify-center">
                <Plus size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Add Organization</h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Organization Name</label>
                <input 
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Science Club"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-500/20 outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Faculty Adviser</label>
                <input 
                  type="text"
                  required
                  value={adviserName}
                  onChange={(e) => setAdviserName(e.target.value)}
                  placeholder="Enter full name..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-500/20 outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Date Established</label>
                <input 
                  type="date"
                  required
                  value={dateEstablished}
                  onChange={(e) => setDateEstablished(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-500/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Logo (Square)</label>
                  <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all">
                    <ImageIcon size={20} className="text-white/20 mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 truncate w-full text-center">
                      {logoFile ? logoFile.name : 'Upload Logo'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Structure Chart</label>
                  <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all">
                    <Upload size={20} className="text-white/20 mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 truncate w-full text-center">
                      {chartFile ? chartFile.name : 'Upload Chart'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setChartFile(e.target.files[0])} />
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-6 rounded-[2rem] bg-maroon-600 hover:bg-maroon-500 text-white font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all shadow-2xl shadow-maroon-900/50 active:scale-95"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18} /> Register Unit</>}
              </button>
            </div>
          </form>
        </div>

        {/* List Content */}
        <div className="xl:col-span-2 space-y-8">
           {loading ? (
             <div className="space-y-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white animate-pulse rounded-[2.5rem]"></div>)}
             </div>
           ) : records.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                 <Users size={48} className="text-gray-100 mx-auto mb-6" />
                 <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">No organizations registered in the database.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
               {records.map((record) => (
                 <div key={record.id} className="group bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:shadow-maroon-900/5">
                    <div className="flex items-center gap-8 flex-1">
                       <div className="w-24 h-24 bg-gray-50 rounded-[1.5rem] flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center p-4">
                          {record.logo_url ? (
                            <img src={record.logo_url} className="w-full h-full object-contain" alt="Logo" />
                          ) : (
                            <Users className="text-gray-200" size={32} />
                          )}
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-4 group-hover:text-maroon-800 transition-colors">
                            {record.org_name}
                          </h3>
                          <div className="flex flex-wrap gap-6">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <Users size={14} className="text-maroon-800" /> {record.adviser_name}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <Calendar size={14} className="text-maroon-800" /> {new Date(record.date_established).getFullYear()}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <button 
                        onClick={() => handleDelete(record.id)}
                        className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                       >
                          <Trash2 size={20} />
                       </button>
                       <button className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-maroon-900 transition-all shadow-xl shadow-gray-900/20">
                          <ChevronRight size={20} />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminRecognizedOrgs;
