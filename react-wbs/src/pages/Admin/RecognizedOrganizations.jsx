import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  ImageIcon, 
  Loader2, 
  Plus, 
  Users,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Zap,
  UserCheck
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
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-outfit">
      {/* Cinematic Identity Header */}
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="text-maroon-800 font-bold uppercase tracking-[0.5em] text-[10px] bg-maroon-50 px-5 py-2 rounded-full">
                 Student Affairs Unit
               </span>
               <div className="h-px w-12 bg-maroon-100"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic">
              Organization <span className="text-maroon-800">Registry</span>
            </h1>
            <p className="text-gray-400 font-medium italic text-lg max-w-2xl">
              Official management portal for recognized institutional groups, student organizations, and academic councils.
            </p>
          </div>

          <div className="relative bg-maroon-950 px-10 py-8 rounded-[2.5rem] shadow-2xl shadow-maroon-950/20 group/stat hover:bg-black transition-all duration-500 border border-white/5">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-maroon-500 border border-white/10 group-hover/stat:scale-110 transition-transform duration-500">
                   <Users size={28} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Active Units</p>
                   <p className="text-4xl font-bold text-white tracking-tighter font-['Playfair_Display'] italic">{records.length}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Sidebar: Registration Console */}
        <div className="xl:col-span-4">
          <div className="bg-gray-950 rounded-[4rem] p-12 shadow-2xl shadow-gray-900/40 text-white sticky top-32 border border-white/5 overflow-hidden group/form">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover/form:opacity-10 transition-opacity">
               <Zap size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 bg-maroon-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-maroon-600/40">
                  <Plus size={28} />
                </div>
                <div>
                   <h2 className="text-3xl font-bold tracking-tighter font-['Playfair_Display'] italic">Register</h2>
                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Unit Identity Portal</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block group-focus-within/input:text-maroon-500 transition-colors">Official Name</label>
                    <input 
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Science Research Council"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-600/20 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block group-focus-within/input:text-maroon-500 transition-colors">Faculty Lead / Adviser</label>
                    <input 
                      type="text"
                      required
                      value={adviserName}
                      onChange={(e) => setAdviserName(e.target.value)}
                      placeholder="Full Name of Adviser"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-600/20 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Establishment Date</label>
                    <input 
                      type="date"
                      required
                      value={dateEstablished}
                      onChange={(e) => setDateEstablished(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-600/20 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Identity Logo</label>
                      <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-maroon-600/40 transition-all group/upload relative overflow-hidden h-32">
                        <ImageIcon size={24} className="text-white/10 group-hover/upload:text-maroon-500 transition-all mb-2" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 truncate w-full text-center px-4">
                          {logoFile ? logoFile.name : 'Upload Asset'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
                      </label>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Structural Map</label>
                      <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-maroon-600/40 transition-all group/upload relative overflow-hidden h-32">
                        <Upload size={24} className="text-white/10 group-hover/upload:text-maroon-500 transition-all mb-2" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 truncate w-full text-center px-4">
                          {chartFile ? chartFile.name : 'Upload Map'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setChartFile(e.target.files[0])} />
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all duration-500 active:scale-95 shadow-2xl bg-white text-maroon-950 hover:bg-maroon-600 hover:text-white group/submit"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Register Unit Protocol
                      <ArrowUpRight size={18} className="group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Registry Log Stream */}
        <div className="xl:col-span-8 space-y-10">
           {loading ? (
             <div className="space-y-8">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-50/50 animate-pulse rounded-[3rem] border border-gray-100"></div>)}
             </div>
           ) : records.length === 0 ? (
              <div className="py-40 text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                 <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-xl border border-gray-100">
                    <Database size={48} />
                 </div>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">The organization registry is currently empty.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 gap-8">
               {records.map((record) => (
                 <div key={record.id} className="group bg-white p-10 rounded-[3.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex items-center gap-10 flex-1">
                       <div className="w-28 h-28 bg-gray-50 rounded-[2rem] flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center p-6 shadow-inner group-hover:scale-105 transition-transform duration-700">
                          {record.logo_url ? (
                            <img src={record.logo_url} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" alt="Identity" />
                          ) : (
                            <Users className="text-gray-200" size={40} />
                          )}
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-2 h-2 rounded-full bg-maroon-800 animate-pulse"></div>
                             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Active Registry Record</span>
                          </div>
                          <h3 className="text-3xl font-bold text-gray-900 tracking-tighter leading-none mb-6 group-hover:text-maroon-800 transition-colors font-['Playfair_Display'] italic">
                            {record.org_name}
                          </h3>
                          <div className="flex flex-wrap gap-8">
                             <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <UserCheck size={16} className="text-maroon-800" /> Lead: {record.adviser_name}
                             </div>
                             <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <Calendar size={16} className="text-maroon-800" /> Established {new Date(record.date_established).getFullYear()}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <button 
                        onClick={() => handleDelete(record.id)}
                        className="w-14 h-14 rounded-3xl bg-white text-gray-300 hover:text-red-600 hover:shadow-2xl transition-all duration-500 border border-gray-100 flex items-center justify-center group/del"
                       >
                          <Trash2 size={22} className="group-hover/del:scale-110 transition-transform" />
                       </button>
                       <button className="w-14 h-14 rounded-3xl bg-maroon-950 text-white flex items-center justify-center hover:bg-black transition-all duration-500 shadow-xl shadow-maroon-950/20 group/next">
                          <ChevronRight size={26} className="group-hover/next:translate-x-1 transition-transform" />
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
