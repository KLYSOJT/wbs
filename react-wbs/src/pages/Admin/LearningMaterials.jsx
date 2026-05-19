import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Loader2, 
  Plus, 
  GraduationCap,
  ChevronRight,
  Database,
  Archive,
  ArrowUpRight,
  ShieldCheck,
  ExternalLink,
  BookMarked
} from 'lucide-react';

const AdminLearningMaterials = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeGrade, setActiveGrade] = useState('Grade 7');

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [quarter, setQuarter] = useState('Quarter 1');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [activeGrade]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('learning_materials')
        .select('*')
        .eq('grade', activeGrade)
        .order('created_at', { ascending: false });
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching materials:', err);
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
        const fileName = `lm-${activeGrade}-${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from('learning-materials').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('learning-materials').getPublicUrl(fileName);
        fileUrl = publicUrl;
      }

      const { error } = await supabase.from('learning_materials').insert([{ 
        title, 
        subject, 
        grade: activeGrade, 
        quarter,
        file_url: fileUrl,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      setTitle('');
      setSubject('');
      setFile(null);
      await fetchRecords();
      alert('Learning material published!');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await supabase.from('learning_materials').delete().eq('id', id);
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
                 Curriculum Management
               </span>
               <div className="h-px w-12 bg-maroon-100"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic">
              Academic <span className="text-maroon-800">Repository</span>
            </h1>
            <p className="text-gray-400 font-medium italic text-lg max-w-2xl">
              Official distribution and archival portal for self-learning modules, digital resources, and educational assets.
            </p>
          </div>

          <div className="relative bg-maroon-950 px-10 py-8 rounded-[2.5rem] shadow-2xl shadow-maroon-950/20 group/stat hover:bg-black transition-all duration-500 border border-white/5">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-maroon-500 border border-white/10 group-hover/stat:scale-110 transition-transform duration-500">
                   <GraduationCap size={28} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Active Stream</p>
                   <p className="text-3xl font-bold text-white tracking-tighter font-['Playfair_Display'] italic">{activeGrade}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Sidebar: Academic Levels */}
        <aside className="xl:col-span-3 space-y-8">
          <div className="bg-gray-950 rounded-[4rem] p-10 shadow-2xl shadow-gray-900/40 text-white border border-white/5 overflow-hidden group/nav sticky top-32">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/nav:opacity-5 transition-opacity">
               <ShieldCheck size={200} />
            </div>
            
            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-4 mb-10 px-4">
                <div className="w-1.5 h-8 bg-maroon-600 rounded-full"></div>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/30">Academic Levels</h3>
              </div>

              <div className="space-y-2">
                {['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setActiveGrade(grade)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeGrade === grade ? 'bg-maroon-600 text-white shadow-2xl' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                  >
                    <span className="font-bold uppercase tracking-tight text-sm relative z-10">{grade}</span>
                    <div className={`transition-all duration-500 relative z-10 ${activeGrade === grade ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                       <ChevronRight size={18} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Console: Material Management */}
        <div className="xl:col-span-9 space-y-12">
          {/* Module Publisher Console */}
          <section className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group/form">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/form:opacity-10 transition-opacity">
                <BookMarked size={150} />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-maroon-50 rounded-3xl flex items-center justify-center text-maroon-800 shadow-xl border border-maroon-100 group-hover/form:rotate-12 transition-transform duration-700">
                     <Plus size={32} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] italic">Material Publisher</h2>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Publishing to: {activeGrade} Archive</p>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="group/input">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block group-focus-within/input:text-maroon-800 transition-colors">Module Title</label>
                        <input 
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. SLM Quarter 1 Week 1"
                          className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                        />
                     </div>
                     <div className="group/input">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block group-focus-within/input:text-maroon-800 transition-colors">Subject Area</label>
                        <input 
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Mathematics"
                          className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                        />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="group/input">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block group-focus-within/input:text-maroon-800 transition-colors">Academic Period</label>
                        <select 
                          value={quarter}
                          onChange={(e) => setQuarter(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all appearance-none cursor-pointer"
                        >
                           <option value="Quarter 1">Quarter 1</option>
                           <option value="Quarter 2">Quarter 2</option>
                           <option value="Quarter 3">Quarter 3</option>
                           <option value="Quarter 4">Quarter 4</option>
                        </select>
                     </div>
                     <div className="group/upload">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Official Module Asset (PDF)</label>
                        <label className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] p-12 cursor-pointer hover:bg-maroon-50 hover:border-maroon-200 transition-all duration-700 group/label relative overflow-hidden h-40">
                          <Upload size={40} className="text-gray-300 group-hover/label:text-maroon-800 transition-all duration-700 mb-4 group-hover/label:-translate-y-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/label:text-maroon-950 transition-colors text-center px-8 truncate w-full">
                            {file ? file.name : 'Select Academic PDF Asset'}
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
                          Commit to Academic Repository
                          <ArrowUpRight size={18} className="opacity-40 group-hover/submit:opacity-100 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-all" />
                        </>
                      )}
                     </button>
                  </div>
               </form>
             </div>
          </section>

          {/* Material Registry Stream */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {loading ? (
               [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-gray-50/50 animate-pulse rounded-[3rem] border border-gray-100"></div>)
             ) : records.length > 0 ? (
               records.map(record => (
                 <div key={record.id} className="group bg-white p-10 rounded-[3.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 flex items-center justify-between gap-8 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex items-center gap-8 min-w-0">
                       <div className="w-20 h-20 bg-maroon-50 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center text-maroon-800 shadow-inner group-hover:scale-105 transition-transform duration-700">
                          <FileText size={32} />
                       </div>
                       <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-maroon-800 animate-pulse"></div>
                             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{record.quarter}</span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 tracking-tighter line-clamp-1 font-['Playfair_Display'] italic group-hover:text-maroon-800 transition-colors">{record.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">{record.subject}</p>
                       </div>
                    </div>
                    <div className="flex flex-col gap-3">
                       <button 
                        onClick={() => handleDelete(record.id)}
                        className="w-12 h-12 rounded-2xl bg-white text-gray-300 hover:text-red-600 hover:shadow-2xl transition-all duration-500 border border-gray-100 flex items-center justify-center group/del"
                       >
                          <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                       </button>
                       <a 
                        href={record.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl bg-maroon-950 text-white flex items-center justify-center hover:bg-black transition-all duration-500 shadow-xl shadow-maroon-950/20 group/view"
                       >
                          <ExternalLink size={20} className="group-hover/view:scale-110 transition-transform" />
                       </a>
                    </div>
                 </div>
               ))
             ) : (
               <div className="col-span-full py-32 text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-gray-100 shadow-xl border border-gray-100">
                     <Archive size={48} />
                  </div>
                  <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest italic">The academic repository for this level is currently empty.</p>
               </div>
             )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminLearningMaterials;
