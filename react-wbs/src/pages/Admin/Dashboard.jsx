import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Megaphone, 
  Newspaper, 
  Upload, 
  Trash2, 
  Loader2,
  Plus,
  BarChart3,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formType, setFormType] = useState('announcement'); // 'announcement' or 'news'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [annRes, newsRes, vidRes] = await Promise.all([
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('news').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('featured_videos').select('*').order('created_at', { ascending: false }).limit(8)
      ]);
      setAnnouncements(annRes.data || []);
      setNews(newsRes.data || []);
      setVideos(vidRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const table = formType === 'announcement' ? 'announcements' : 'news';
    const storageBucket = formType === 'announcement' ? 'announcement-images' : 'news-images';

    try {
      let imageUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage.from(storageBucket).upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from(storageBucket).getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase.from(table).insert([{ 
        title, 
        description, 
        image_url: imageUrl,
        created_at: new Date().toISOString()
      }]);

      if (insertError) throw insertError;

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      await fetchData();
      alert('Content published successfully!');
    } catch (err) {
      console.error('Publish error:', err);
      alert(`Publish failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      alert('Delete operation failed.');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20 font-outfit">
      {/* Cinematic Command Header */}
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="text-maroon-800 font-bold uppercase tracking-[0.5em] text-[10px] bg-maroon-50 px-5 py-2 rounded-full">
                 System Command
               </span>
               <div className="h-px w-12 bg-maroon-100"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic">
              Management <span className="text-maroon-800">Overview</span>
            </h1>
            <p className="text-gray-400 font-medium italic text-lg">
              Authorized session for <span className="text-gray-900 font-bold">@{user?.email?.split('@')[0]}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="bg-gray-50/80 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-8 shadow-inner group/stat hover:bg-white transition-all duration-500">
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Live Assets</p>
                <p className="text-4xl font-bold text-maroon-950 tracking-tighter font-['Playfair_Display'] italic">
                  {announcements.length + news.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-maroon-900 shadow-xl group-hover/stat:rotate-12 transition-all duration-500">
                <BarChart3 size={28} />
              </div>
            </div>

            <div className="bg-maroon-950 px-10 py-6 rounded-[2.5rem] flex items-center gap-8 shadow-2xl shadow-maroon-950/20 group/stat hover:bg-black transition-all duration-500 border border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Node Status</p>
                <p className="text-4xl font-bold text-white tracking-tighter font-['Playfair_Display'] italic">Operational</p>
              </div>
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-maroon-500 shadow-2xl border border-white/10 group-hover/stat:scale-110 transition-all duration-500">
                <Globe size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Sidebar: Content Composer */}
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
                   <h2 className="text-3xl font-bold tracking-tighter font-['Playfair_Display'] italic">Composer</h2>
                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Drafting Portal</p>
                </div>
              </div>

              <form onSubmit={handlePublish} className="space-y-10">
                {/* Protocol Switcher */}
                <div className="flex bg-white/5 rounded-2xl p-2 border border-white/10">
                  <button 
                    type="button"
                    onClick={() => setFormType('announcement')}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${formType === 'announcement' ? 'bg-maroon-600 text-white shadow-2xl' : 'text-white/30 hover:text-white'}`}
                  >
                    Announcement
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormType('news')}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${formType === 'news' ? 'bg-white text-maroon-950 shadow-2xl' : 'text-white/30 hover:text-white'}`}
                  >
                    News Article
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-4 block group-focus-within/input:text-maroon-500 transition-colors">Headline Context</label>
                    <input 
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Specify the publication title..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-600/20 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="group/input">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-4 block group-focus-within/input:text-maroon-500 transition-colors">Full Publication Body</label>
                    <textarea 
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Input the core message or news body here..."
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-600/20 outline-none transition-all h-48 resize-none placeholder:text-white/10 custom-scrollbar"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-4 block">Visual Asset Interface</label>
                    <label className="flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem] p-10 cursor-pointer hover:bg-white/10 hover:border-maroon-600/40 transition-all group/upload relative overflow-hidden">
                      <div className="relative z-10 flex flex-col items-center">
                        <Upload size={40} className="text-white/10 group-hover/upload:text-maroon-500 transition-all duration-700 mb-6 group-hover/upload:-translate-y-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover/upload:text-white transition-colors">
                          {file ? file.name : 'Upload High-Res Asset'}
                        </span>
                      </div>
                      <input 
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
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
                      Execute Publication
                      <ArrowUpRight size={18} className="group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Content Stream: Registry Logs */}
        <div className="xl:col-span-8 space-y-16">
          {/* Announcements Log */}
          <section>
            <div className="flex items-center justify-between mb-10 px-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-maroon-50 rounded-xl flex items-center justify-center text-maroon-800 shadow-inner">
                    <Megaphone size={20} />
                 </div>
                 <h2 className="text-3xl font-bold tracking-tighter text-gray-900 font-['Playfair_Display'] italic">
                  Live Announcements
                </h2>
              </div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">Archival Feed v2.4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-56 bg-gray-50/50 animate-pulse rounded-[3rem] border border-gray-100"></div>)
              ) : announcements.length > 0 ? (
                announcements.map(ann => (
                  <div key={ann.id} className="group bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/30 border border-gray-100 flex flex-col justify-between transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex gap-8">
                      <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex-shrink-0 overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
                        {ann.image_url ? (
                          <img src={ann.image_url} className="w-full h-full object-cover" alt="Thumb" />
                        ) : (
                          <Megaphone className="w-full h-full p-6 text-gray-200" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-maroon-800 animate-pulse"></div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </p>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 tracking-tight line-clamp-2 group-hover:text-maroon-800 transition-colors font-['Playfair_Display'] italic">
                          {ann.title}
                        </h4>
                      </div>
                    </div>
                    <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                      <button 
                        onClick={() => handleDelete('announcements', ann.id)}
                        className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-3 group/del"
                      >
                        <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" /> Remove Entry
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-maroon-950 group-hover:text-white transition-all duration-500 group-hover:rotate-45">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">The announcement registry is currently clear.</p>
                </div>
              )}
            </div>
          </section>

          {/* News Registry Log */}
          <section>
            <div className="flex items-center justify-between mb-10 px-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-950 rounded-xl flex items-center justify-center text-white shadow-xl">
                    <Newspaper size={20} />
                 </div>
                 <h2 className="text-3xl font-bold tracking-tighter text-gray-900 font-['Playfair_Display'] italic">
                  Journalism Feed
                </h2>
              </div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">Public Press Protocol</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-56 bg-gray-50/50 animate-pulse rounded-[3rem] border border-gray-100"></div>)
              ) : news.length > 0 ? (
                news.map(n => (
                  <div key={n.id} className="group bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/30 border border-gray-100 flex flex-col justify-between transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex gap-8">
                      <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex-shrink-0 overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
                        {n.image_url ? (
                          <img src={n.image_url} className="w-full h-full object-cover" alt="Thumb" />
                        ) : (
                          <Newspaper className="w-full h-full p-6 text-gray-200" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-gray-950"></div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </p>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 tracking-tight line-clamp-2 group-hover:text-black transition-colors font-['Playfair_Display'] italic">
                          {n.title}
                        </h4>
                      </div>
                    </div>
                    <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                      <button 
                        onClick={() => handleDelete('news', n.id)}
                        className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-3 group/del"
                      >
                        <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" /> Remove Entry
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-gray-950 group-hover:text-white transition-all duration-500 group-hover:rotate-45">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">The journalism registry is currently empty.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
