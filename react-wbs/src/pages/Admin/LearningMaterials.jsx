import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Loader2, 
  Plus, 
  Search,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Database,
  Archive,
  CheckCircle2
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
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-roboto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Curriculum Management</span>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Learning Materials</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Distribute official self-learning modules and digital resources.</p>
        </div>
        <div className="relative z-10 bg-maroon-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-maroon-900/20 flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Stream</p>
              <p className="text-2xl font-black italic tracking-tighter">{activeGrade}</p>
           </div>
           <GraduationCap size={40} className="text-white/20" />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        {/* Sidebar: Grade Selector */}
        <aside className="xl:col-span-1 space-y-6">
           <div className="bg-gray-900 rounded-[3rem] p-8 shadow-2xl shadow-gray-900/40 text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 px-4">Academic Levels</h3>
              <div className="space-y-2">
                 {['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map((grade) => (
                   <button
                    key={grade}
                    onClick={() => setActiveGrade(grade)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${activeGrade === grade ? 'bg-maroon-600 text-white shadow-xl' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                   >
                     <span className="font-black uppercase italic tracking-tighter text-sm">{grade}</span>
                     <ChevronRight size={16} className={`transition-transform ${activeGrade === grade ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                   </button>
                 ))}
              </div>
           </div>
        </aside>

        {/* Main: Form & List */}
        <div className="xl:col-span-3 space-y-12">
           <section className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-maroon-50 rounded-2xl flex items-center justify-center text-maroon-800 shadow-sm">
                    <Plus size={24} />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Material Publisher</h2>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Module Title</label>
                       <input 
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. SLM Quarter 1 Week 1"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Subject Area</label>
                       <input 
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Mathematics"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Academic Period</label>
                       <select 
                        value={quarter}
                        onChange={(e) => setQuarter(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-maroon-50 outline-none"
                       >
                          <option value="Quarter 1">Quarter 1</option>
                          <option value="Quarter 2">Quarter 2</option>
                          <option value="Quarter 3">Quarter 3</option>
                          <option value="Quarter 4">Quarter 4</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">PDF Module Asset</label>
                       <label className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-8 cursor-pointer hover:bg-maroon-50 transition-all group">
                          <Upload size={32} className="text-gray-300 group-hover:text-maroon-800 transition-colors mb-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-maroon-900">
                             {file ? file.name : 'Select Module PDF'}
                          </span>
                          <input type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                       </label>
                    </div>
                 </div>

                 <div className="lg:col-span-2 pt-6">
                    <button 
                     type="submit"
                     disabled={submitting}
                     className="w-full py-6 rounded-[2rem] bg-gray-900 text-white font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl hover:bg-maroon-900 active:scale-95"
                    >
                     {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Database size={20} /> Execute Publication</>}
                    </button>
                 </div>
              </form>
           </section>

           <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-32 bg-white animate-pulse rounded-[2.5rem]"></div>)
              ) : records.length > 0 ? (
                records.map(record => (
                  <div key={record.id} className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex items-center justify-between transition-all hover:shadow-maroon-900/5">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-maroon-800">
                           <FileText size={24} />
                        </div>
                        <div>
                           <h4 className="text-lg font-black uppercase italic tracking-tighter text-gray-900 line-clamp-1">{record.title}</h4>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{record.subject} • {record.quarter}</p>
                        </div>
                     </div>
                     <button 
                      onClick={() => handleDelete(record.id)}
                      className="p-3 text-gray-200 hover:text-red-500 transition-colors"
                     >
                        <Trash2 size={20} />
                     </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                   <Archive size={48} className="text-gray-100 mx-auto mb-6" />
                   <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">No materials archived for this level.</p>
                </div>
              )}
           </section>
        </div>
      </div>
    </div>
  );
};

export default AdminLearningMaterials;
