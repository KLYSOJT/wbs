import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  ImageIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Users,
  ChevronRight,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

const departments = [
  { id: 'TLE', name: 'TLE DEPARTMENT' },
  { id: 'Math', name: 'MATH DEPARTMENT' },
  { id: 'English', name: 'ENGLISH DEPARTMENT' },
  { id: 'Science', name: 'SCIENCE DEPARTMENT' },
  { id: 'Filipino', name: 'FILIPINO DEPARTMENT' },
  { id: 'AP', name: 'AP DEPARTMENT' },
  { id: 'MAPEH', name: 'MAPEH DEPARTMENT' },
  { id: 'Values Education', name: 'VALUES EDUCATION DEPARTMENT' },
];

const AdminOrgStructure = () => {
  const [activeDept, setActiveDept] = useState(departments[0]);
  const [deptData, setDeptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchDeptData();
  }, [activeDept]);

  const fetchDeptData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizational_structure')
        .select('*')
        .eq('department', activeDept.id)
        .single();
      
      setDeptData(data || null);
    } catch (err) {
      console.error('Error fetching dept data:', err);
      setDeptData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `org-${activeDept.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('organizational-charts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('organizational-charts')
        .getPublicUrl(fileName);

      const payload = {
        department: activeDept.id,
        image: publicUrl,
        updated_at: new Date().toISOString()
      };

      if (deptData) {
        await supabase.from('organizational_structure').update(payload).eq('id', deptData.id);
      } else {
        await supabase.from('organizational_structure').insert([payload]);
      }

      setFile(null);
      await fetchDeptData();
      alert('Department chart updated successfully!');
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove this organizational chart?')) return;
    try {
      await supabase.from('organizational_structure').delete().eq('department', activeDept.id);
      await fetchDeptData();
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
                 Institutional Hierarchy
               </span>
               <div className="h-px w-12 bg-maroon-100"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic">
              Org Structure <span className="text-maroon-800">Management</span>
            </h1>
            <p className="text-gray-400 font-medium italic text-lg max-w-2xl">
              Systematic archival and management of official departmental personnel hierarchies and organizational maps.
            </p>
          </div>

          <div className="relative bg-maroon-950 px-10 py-8 rounded-[2.5rem] shadow-2xl shadow-maroon-950/20 group/stat hover:bg-black transition-all duration-500 border border-white/5">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-maroon-500 border border-white/10 group-hover/stat:scale-110 transition-transform duration-500">
                   <Database size={28} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Source Protocol</p>
                   <p className="text-xl font-bold text-white tracking-tighter font-['Playfair_Display'] italic">Cloud Registry</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Sidebar: Department Navigation */}
        <aside className="xl:col-span-4 space-y-8">
          <div className="bg-gray-950 rounded-[4rem] p-10 shadow-2xl shadow-gray-900/40 text-white border border-white/5 overflow-hidden group/nav">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/nav:opacity-5 transition-opacity">
               <ShieldCheck size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10 px-4">
                <div className="w-1.5 h-8 bg-maroon-600 rounded-full"></div>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/30">Departmental Units</h3>
              </div>

              <div className="space-y-2">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setActiveDept(dept)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeDept.id === dept.id ? 'bg-maroon-600 text-white shadow-2xl' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                  >
                    <span className="font-bold uppercase tracking-tight text-sm relative z-10">{dept.name}</span>
                    <div className={`transition-all duration-500 relative z-10 ${activeDept.id === dept.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                       <ChevronRight size={18} />
                    </div>
                    {activeDept.id === dept.id && (
                       <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] animate-[shimmer_2s_infinite]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Console: Directory Management */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-[4rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col h-full group/console">
            <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <Zap size={100} />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-maroon-800 shadow-xl border border-gray-100 group-hover/console:rotate-12 transition-transform duration-700">
                    <Users size={32} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] italic">{activeDept.name}</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Active Personnel Record</p>
                 </div>
              </div>
              {deptData && (
                <button 
                  onClick={handleDelete}
                  className="w-12 h-12 bg-white text-gray-300 hover:text-red-600 hover:shadow-2xl rounded-2xl transition-all duration-500 border border-gray-100 flex items-center justify-center group/del"
                >
                  <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                </button>
              )}
            </div>

            <div className="p-12 flex-1 flex flex-col lg:flex-row gap-16 relative z-10">
              {/* Visual Canvas (Preview) */}
              <div className="lg:w-1/2 flex flex-col">
                <div className="flex items-center justify-between mb-6 px-4">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Institutional Asset</p>
                   {deptData && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                </div>
                <div className="flex-1 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group/chart min-h-[400px] shadow-inner">
                  {loading ? (
                    <div className="flex flex-col items-center gap-4">
                       <Loader2 className="animate-spin text-maroon-800" size={40} />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decrypting Asset...</span>
                    </div>
                  ) : deptData?.image ? (
                    <img src={deptData.image} alt="Hierarchy" className="w-full h-full object-contain p-8 transition-transform duration-1000 group-hover/chart:scale-110" />
                  ) : (
                    <div className="text-center p-12">
                       <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-xl border border-gray-100">
                          <ImageIcon size={40} />
                       </div>
                       <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No Official Hierarchy Published</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-maroon-950/40 opacity-0 group-hover/chart:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                     <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em] border border-white/20 px-8 py-3 rounded-full">Secure Preview</span>
                  </div>
                </div>
              </div>

              {/* Upload Interface (Protocol) */}
              <div className="lg:w-1/2 space-y-10 flex flex-col justify-center">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 tracking-tighter mb-4 font-['Playfair_Display'] italic">Update Registry</h4>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Deploy a new organizational map for the <span className="text-gray-900 font-bold">{activeDept.name.toLowerCase()}</span>. Assets must be in high-resolution JPG or PNG format for optimal presentation.
                  </p>
                </div>

                <form onSubmit={handleUpload} className="space-y-8">
                  <label className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] p-12 cursor-pointer hover:bg-maroon-50 hover:border-maroon-200 transition-all duration-700 group/upload relative overflow-hidden">
                    <Upload size={48} className="text-gray-300 group-hover/upload:text-maroon-800 transition-all duration-700 mb-6 group-hover/upload:-translate-y-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/upload:text-maroon-950 transition-colors text-center px-6">
                      {file ? file.name : 'Choose Official Media Asset'}
                    </span>
                    <input 
                      type="file" 
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden" 
                      accept="image/*"
                    />
                  </label>

                  <button 
                    disabled={submitting || !file}
                    className="w-full bg-maroon-950 text-white py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-maroon-950/20 hover:bg-black transition-all duration-500 active:scale-95 disabled:opacity-20 flex items-center justify-center gap-4 group/submit"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} className="text-maroon-500" />}
                    Commit Record Changes
                    <ArrowUpRight size={16} className="opacity-40 group-hover/submit:opacity-100 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-all" />
                  </button>
                </form>

                {deptData?.updated_at && (
                  <div className="pt-10 border-t border-gray-50 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <AlertCircle size={14} className="text-maroon-800" /> 
                        Last Verified Protocol: {new Date(deptData.updated_at).toLocaleString()}
                     </div>
                     <Sparkles size={14} className="text-maroon-500/20" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrgStructure;
