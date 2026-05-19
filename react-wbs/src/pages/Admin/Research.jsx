import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Loader2, 
  Plus, 
  BookOpen,
  Tag,
  Calendar,
  ChevronRight,
  GraduationCap,
  ImageIcon,
  ArrowUpRight,
  Clock,
  ExternalLink,
  BookMarked,
  FlaskConical,
  Award
} from 'lucide-react';

const AdminResearch = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState('Action Research');
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('research')
        .select('*')
        .order('created_at', { ascending: false });
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching research:', err);
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
      const fileUrl = await handleUpload(file, 'research-pdfs');
      const imageUrl = await handleUpload(imageFile, 'research-covers');

      const payload = {
        title,
        department,
        grade,
        year: parseInt(year),
        category,
        file: fileUrl,
        image: imageUrl,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('research').insert([payload]);
      if (error) throw error;

      // Reset
      setTitle('');
      setDepartment('');
      setGrade('');
      setFile(null);
      setImageFile(null);
      await fetchRecords();
      alert('Research paper published successfully!');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this research record?')) return;
    try {
      await supabase.from('research').delete().eq('id', id);
      await fetchRecords();
    } catch (err) {
      alert('Delete failed');
    }
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
                 Academic Repository
               </span>
               <div className="h-px w-12 bg-maroon-100"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic">
              Innovation <span className="text-maroon-800">Vault</span>
            </h1>
            <p className="text-gray-400 font-medium italic text-lg max-w-2xl">
              Secure preservation protocol for institutional scholarly works, action research, and pedagogical innovations.
            </p>
          </div>

          <div className="relative bg-maroon-950 px-10 py-8 rounded-[2.5rem] shadow-2xl shadow-maroon-950/20 group/stat hover:bg-black transition-all duration-500 border border-white/5">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-maroon-500 border border-white/10 group-hover/stat:scale-110 transition-transform duration-500">
                   <FlaskConical size={28} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Digital Papers</p>
                   <p className="text-4xl font-bold text-white tracking-tighter font-['Playfair_Display'] italic">{records.length}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Sidebar: Publisher Console */}
        <div className="xl:col-span-4">
          <div className="bg-gray-950 rounded-[4rem] p-12 shadow-2xl shadow-gray-900/40 text-white sticky top-32 border border-white/5 overflow-hidden group/form">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover/form:opacity-10 transition-opacity">
               <Award size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 bg-maroon-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-maroon-600/40">
                  <Plus size={28} />
                </div>
                <div>
                   <h2 className="text-3xl font-bold tracking-tighter font-['Playfair_Display'] italic">Archive Paper</h2>
                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Scholarly Asset Entry</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block group-focus-within/input:text-maroon-500 transition-colors">Research Title</label>
                    <input 
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter full research title..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-600/20 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group/input">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Department</label>
                      <select 
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 outline-none appearance-none cursor-pointer text-white/60"
                      >
                        <option value="">Select</option>
                        <option value="science">Science</option>
                        <option value="math">Mathematics</option>
                        <option value="english">English</option>
                        <option value="ap">Social Studies</option>
                      </select>
                    </div>
                    <div className="group/input">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Level</label>
                      <select 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 outline-none appearance-none cursor-pointer text-white/60"
                      >
                        <option value="">Select</option>
                        <option value="grade-7">Grade 7</option>
                        <option value="grade-8">Grade 8</option>
                        <option value="grade-9">Grade 9</option>
                        <option value="grade-10">Grade 10</option>
                        <option value="grade-11">Grade 11</option>
                        <option value="grade-12">Grade 12</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group/input">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 outline-none appearance-none cursor-pointer text-white/60"
                      >
                        <option value="Action Research">Action Research</option>
                        <option value="Applied Research">Applied Research</option>
                        <option value="Case Study">Case Study</option>
                      </select>
                    </div>
                    <div className="group/input">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Year</label>
                      <input 
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-xs font-bold focus:bg-white/10 outline-none text-white/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Full PDF</label>
                      <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-maroon-600/40 transition-all group/upload relative overflow-hidden h-32">
                        <Upload size={24} className="text-white/10 group-hover/upload:text-maroon-500 transition-all mb-2" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 truncate w-full text-center px-4">
                          {file ? file.name : 'Upload PDF'}
                        </span>
                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                      </label>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Cover Image</label>
                      <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-maroon-600/40 transition-all group/upload relative overflow-hidden h-32">
                        <ImageIcon size={24} className="text-white/10 group-hover/upload:text-maroon-500 transition-all mb-2" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 truncate w-full text-center px-4">
                          {imageFile ? imageFile.name : 'Upload Image'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
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
                      Archive Scholarly Paper
                      <ArrowUpRight size={18} className="group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Scholarly Registry Stream */}
        <div className="xl:col-span-8 space-y-10">
           {loading ? (
             <div className="space-y-8">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-50/50 animate-pulse rounded-[3rem] border border-gray-100"></div>)}
             </div>
           ) : records.length === 0 ? (
              <div className="py-40 text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                 <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-xl border border-gray-100">
                    <BookMarked size={48} />
                 </div>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">The innovation vault is currently empty.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 gap-8">
               {records.map((record) => (
                 <article key={record.id} className="group bg-white p-10 rounded-[3.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex items-center gap-10 flex-1 min-w-0">
                       <div className="w-36 h-36 bg-gray-50 rounded-[2.5rem] flex-shrink-0 overflow-hidden border border-gray-100 relative group/cover shadow-inner">
                          {record.image ? (
                            <img src={record.image} className="w-full h-full object-cover grayscale group-hover/cover:grayscale-0 transition-all duration-700 group-hover/cover:scale-110" alt="Identity" />
                          ) : (
                            <BookOpen className="w-full h-full p-10 text-gray-200" />
                          )}
                          <div className="absolute top-4 left-4">
                             <div className="bg-maroon-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-2xl">
                                {record.category}
                             </div>
                          </div>
                       </div>
                       <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-2 h-2 rounded-full bg-maroon-800 animate-pulse"></div>
                             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Digital Scholarly Asset</span>
                          </div>
                          <h3 className="text-3xl font-bold text-gray-900 tracking-tighter leading-tight mb-6 group-hover:text-maroon-800 transition-colors font-['Playfair_Display'] italic line-clamp-2">
                            {record.title}
                          </h3>
                          <div className="flex flex-wrap gap-8">
                             <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <GraduationCap size={16} className="text-maroon-800" /> {record.grade}
                             </div>
                             <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <Tag size={16} className="text-maroon-800" /> {record.department}
                             </div>
                             <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <Clock size={16} className="text-maroon-800" /> {record.year}
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
                       <a 
                        href={record.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-3xl bg-maroon-950 text-white flex items-center justify-center hover:bg-black transition-all duration-500 shadow-xl shadow-maroon-950/20 group/next"
                       >
                          <ExternalLink size={24} className="group-hover/next:scale-110 transition-transform" />
                       </a>
                    </div>
                 </article>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminResearch;
