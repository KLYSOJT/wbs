import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Navigation,
  Globe,
  Settings
} from 'lucide-react';

const AdminLocation = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    address: 'X85C+R5C, Quipot, Tiaong, Quezon',
    phone: '0949 995 1769',
    email: 'rectomns301380@gmail.com',
    hours: 'Mon - Fri • 7:30 - 4:30',
    map_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase
        .from('school_config')
        .select('*')
        .eq('key', 'location_info')
        .single();
      
      if (res) setData(res.value);
    } catch (err) {
      console.error('Error fetching location config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('school_config')
        .upsert({ 
          key: 'location_info', 
          value: data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Location information updated successfully!');
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 font-roboto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Institutional Access</span>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Location & Contact</h1>
          <p className="text-gray-400 mt-4 font-medium italic">Update the official geographic and contact records for the institution.</p>
        </div>
        <div className="relative z-10 bg-maroon-50 p-6 rounded-[2rem] border border-maroon-100">
           <MapPin className="text-maroon-800" size={32} />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
            <Settings size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Configuration Portal</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                <MapPin size={14} className="text-maroon-800" /> Physical Address
              </label>
              <textarea 
                value={data.address}
                onChange={(e) => setData({...data, address: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all h-24 resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                <Phone size={14} className="text-maroon-800" /> Contact Number
              </label>
              <input 
                type="text"
                value={data.phone}
                onChange={(e) => setData({...data, phone: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                <Mail size={14} className="text-maroon-800" /> Official Email
              </label>
              <input 
                type="email"
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                <Clock size={14} className="text-maroon-800" /> Administrative Hours
              </label>
              <input 
                type="text"
                value={data.hours}
                onChange={(e) => setData({...data, hours: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-gray-50">
          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-6 rounded-[2rem] bg-maroon-900 text-white font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl hover:bg-maroon-800 active:scale-95"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Commit System Updates</>}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center gap-8">
         <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            <Globe size={14} /> Regional Synchronized
         </div>
         <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            <Navigation size={14} /> GPS Calibrated
         </div>
      </div>
    </div>
  );
};

export default AdminLocation;
