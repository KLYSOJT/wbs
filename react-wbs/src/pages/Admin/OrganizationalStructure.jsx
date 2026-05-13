import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  ImageIcon, 
  Loader2, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Users,
  ChevronRight,
  Database
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
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Hierarchy</span>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Org Structure Management</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Upload and manage official departmental organizational charts.</p>
        </div>
        <div className="relative z-10 bg-maroon-50 p-6 rounded-[2rem] border border-maroon-100 flex items-center gap-4">
           <Database className="text-maroon-800" size={32} />
           <div>
              <p className="text-[10px] font-black text-maroon-800/40 uppercase tracking-widest">Active Database</p>
              <p className="text-lg font-black text-maroon-900 uppercase italic tracking-tighter">Organizational_Structure</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Sidebar: Department List */}
        <aside className="xl:col-span-1 space-y-4">
          <div className="bg-gray-900 rounded-[3rem] p-8 shadow-2xl shadow-gray-900/40 text-white">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 px-4">Departmental Units</h3>
            <div className="space-y-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setActiveDept(dept)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${activeDept.id === dept.id ? 'bg-maroon-600 text-white shadow-xl' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                >
                  <span className="font-black uppercase italic tracking-tighter text-sm">{dept.name}</span>
                  <ChevronRight size={16} className={`transition-transform ${activeDept.id === dept.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Area: Management Card */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-maroon-800 shadow-sm">
                    <Users size={24} />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{activeDept.name}</h2>
              </div>
              {deptData && (
                <button 
                  onClick={handleDelete}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="p-12 flex-1 flex flex-col lg:flex-row gap-12">
              {/* Preview Side */}
              <div className="lg:w-1/2 flex flex-col">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Current Chart Preview</p>
                <div className="flex-1 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group min-h-[300px]">
                  {loading ? (
                    <Loader2 className="animate-spin text-maroon-800" size={32} />
                  ) : deptData?.image ? (
                    <img src={deptData.image} alt="Chart" className="w-full h-full object-contain p-6 transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="text-center p-8">
                       <ImageIcon size={48} className="text-gray-200 mx-auto mb-4" />
                       <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">No record found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Side */}
              <div className="lg:w-1/2 space-y-8 flex flex-col justify-center">
                <div>
                  <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter mb-2">Update Visual Records</h4>
                  <p className="text-xs text-gray-400 font-medium">Please upload the official JPG/PNG format of the {activeDept.name.toLowerCase()} chart.</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  <label className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-10 cursor-pointer hover:bg-maroon-50 hover:border-maroon-200 transition-all group">
                    <Upload size={32} className="text-gray-300 group-hover:text-maroon-800 transition-colors mb-4" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-maroon-900">
                      {file ? file.name : 'Select Media Asset'}
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
                    className="w-full bg-maroon-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-maroon-900/20 hover:bg-maroon-800 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    Commit Changes
                  </button>
                </form>

                {deptData?.updated_at && (
                  <div className="pt-6 border-t border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                     <AlertCircle size={12} /> Last verified: {new Date(deptData.updated_at).toLocaleString()}
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
