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
  Tag,
  Calendar,
  ChevronRight,
  Database,
  User,
  GraduationCap
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
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-roboto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Academic Repository</span>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Research Management</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Catalogue and preserve institutional scholarly works.</p>
        </div>
        <div className="relative z-10 bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-900/20 flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Digital Papers</p>
              <p className="text-3xl font-black italic tracking-tighter">{records.length}</p>
           </div>
           <BookOpen size={40} className="text-maroon-600" />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Sidebar: Publisher */}
        <div className="xl:col-span-1">
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-[3.5rem] p-10 shadow-2xl shadow-gray-900/40 text-white sticky top-12">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-maroon-600 rounded-2xl flex items-center justify-center">
                <Plus size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Archive Paper</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Research Title</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter full research title..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-500/20 outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Department</label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest focus:bg-white/10 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="science">Science</option>
                    <option value="math">Mathematics</option>
                    <option value="english">English</option>
                    <option value="ap">Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Grade Level</label>
                  <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest focus:bg-white/10 outline-none"
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
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest focus:bg-white/10 outline-none"
                  >
                    <option value="Action Research">Action Research</option>
                    <option value="Applied Research">Applied Research</option>
                    <option value="Case Study">Case Study</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Year</label>
                  <input 
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest focus:bg-white/10 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Full PDF</label>
                  <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all">
                    <Upload size={20} className="text-white/20 mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 truncate w-full text-center">
                      {file ? file.name : 'Upload PDF'}
                    </span>
                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Cover Image</label>
                  <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all">
                    <ImageIcon size={20} className="text-white/20 mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 truncate w-full text-center">
                      {imageFile ? imageFile.name : 'Upload Image'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-6 rounded-[2rem] bg-maroon-600 hover:bg-maroon-500 text-white font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all shadow-2xl shadow-maroon-900/50 active:scale-95"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Database size={18} /> Archive Paper</>}
              </button>
            </div>
          </form>
        </div>

        {/* List: Records */}
        <div className="xl:col-span-2 space-y-8">
           {loading ? (
              <div className="space-y-6">
                 {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white animate-pulse rounded-[3rem]"></div>)}
              </div>
           ) : records.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                 <BookOpen size={48} className="text-gray-100 mx-auto mb-6" />
                 <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">The research repository is currently empty.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 gap-8">
               {records.map((record) => (
                 <article key={record.id} className="group bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-10 transition-all hover:shadow-maroon-900/5">
                    <div className="flex items-center gap-10 flex-1">
                       <div className="w-32 h-32 bg-gray-50 rounded-[2rem] flex-shrink-0 overflow-hidden border border-gray-100 relative group">
                          {record.image ? (
                            <img src={record.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Cover" />
                          ) : (
                            <BookOpen className="w-full h-full p-8 text-gray-200" />
                          )}
                          <div className="absolute top-3 left-3">
                             <span className="bg-maroon-900 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                                {record.category[0]}
                             </span>
                          </div>
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight mb-4 group-hover:text-maroon-800 transition-colors line-clamp-2">
                            {record.title}
                          </h3>
                          <div className="flex flex-wrap gap-8">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <GraduationCap size={16} className="text-maroon-800" /> {record.grade}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <Tag size={16} className="text-maroon-800" /> {record.department}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <Calendar size={16} className="text-maroon-800" /> {record.year}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <button 
                        onClick={() => handleDelete(record.id)}
                        className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                       >
                          <Trash2 size={24} />
                       </button>
                       <button className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-maroon-900 transition-all shadow-xl shadow-gray-900/20">
                          <ChevronRight size={24} />
                       </button>
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
