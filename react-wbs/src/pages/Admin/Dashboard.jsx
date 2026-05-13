import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Megaphone, 
  Newspaper, 
  Video, 
  Upload, 
  Trash2, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  BarChart3,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
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
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
      {/* Header & Stats Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-maroon-50 rounded-full -mr-48 -mt-48 opacity-50"></div>
        <div className="relative z-10">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">System Command Center</span>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Admin Dashboard</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Welcome back, {user?.email?.split('@')[0] || 'Administrator'}</p>
        </div>

        <div className="flex flex-wrap gap-4 relative z-10">
          <div className="bg-gray-50 px-8 py-4 rounded-[2rem] border border-gray-100 flex items-center gap-6 shadow-inner">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Posts</p>
              <p className="text-2xl font-black text-maroon-900 italic tracking-tighter">{announcements.length + news.length}</p>
            </div>
            <BarChart3 className="text-maroon-800 opacity-20" size={32} />
          </div>
          <div className="bg-green-50 px-8 py-4 rounded-[2rem] border border-green-100 flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-green-600/60 uppercase tracking-widest">Status</p>
              <p className="text-2xl font-black text-green-700 italic tracking-tighter">Online</p>
            </div>
            <Globe className="text-green-600 opacity-20" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Sidebar: Publisher Form */}
        <div className="xl:col-span-1">
          <form onSubmit={handlePublish} className="bg-gray-900 rounded-[3.5rem] p-10 shadow-2xl shadow-gray-900/40 text-white sticky top-12">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-maroon-600 rounded-2xl flex items-center justify-center">
                <Plus size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Content Creator</h2>
            </div>

            <div className="space-y-8">
              {/* Type Switcher */}
              <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10">
                <button 
                  type="button"
                  onClick={() => setFormType('announcement')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formType === 'announcement' ? 'bg-maroon-600 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
                >
                  Announcement
                </button>
                <button 
                  type="button"
                  onClick={() => setFormType('news')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formType === 'news' ? 'bg-blue-600 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
                >
                  News Article
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Publication Title</label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a compelling headline..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-500/20 outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Detailed Description</label>
                  <textarea 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write the full content here..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white/10 focus:ring-4 focus:ring-maroon-500/20 outline-none transition-all h-40 resize-none placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Hero Media Asset</label>
                  <label className="flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] p-8 cursor-pointer hover:bg-white/10 transition-all group">
                    <Upload size={32} className="text-white/20 group-hover:text-maroon-500 transition-colors mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                      {file ? file.name : 'Choose File'}
                    </span>
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
                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${formType === 'announcement' ? 'bg-maroon-600 hover:bg-maroon-500 shadow-maroon-900/50' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50'}`}
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>Publish To Web <ArrowUpRight size={18} /></>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Feed: Recent Content */}
        <div className="xl:col-span-2 space-y-12">
          {/* Announcements Feed */}
          <section>
            <div className="flex items-center justify-between mb-8 px-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-4">
                <Megaphone className="text-maroon-800" /> Recent Announcements
              </h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Feed v2.1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-48 bg-white animate-pulse rounded-[2.5rem]"></div>)
              ) : announcements.length > 0 ? (
                announcements.map(ann => (
                  <div key={ann.id} className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col justify-between transition-all hover:shadow-maroon-900/5">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                        {ann.image_url ? (
                          <img src={ann.image_url} className="w-full h-full object-cover" alt="Thumb" />
                        ) : (
                          <Megaphone className="w-full h-full p-4 text-gray-200" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter line-clamp-1 group-hover:text-maroon-800 transition-colors">
                          {ann.title}
                        </h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                          {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <button 
                        onClick={() => handleDelete('announcements', ann.id)}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Remove Entry
                      </button>
                      <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-maroon-800 transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">The announcement feed is currently empty.</p>
                </div>
              )}
            </div>
          </section>

          {/* News Feed */}
          <section>
            <div className="flex items-center justify-between mb-8 px-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-4">
                <Newspaper className="text-blue-600" /> Journalism Feed
              </h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public Press</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-48 bg-white animate-pulse rounded-[2.5rem]"></div>)
              ) : news.length > 0 ? (
                news.map(n => (
                  <div key={n.id} className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col justify-between transition-all hover:shadow-blue-900/5">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                        {n.image_url ? (
                          <img src={n.image_url} className="w-full h-full object-cover" alt="Thumb" />
                        ) : (
                          <Newspaper className="w-full h-full p-4 text-gray-200" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {n.title}
                        </h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                          {new Date(n.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <button 
                        onClick={() => handleDelete('news', n.id)}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Remove Article
                      </button>
                      <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-blue-600 transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">The news repository is currently empty.</p>
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
