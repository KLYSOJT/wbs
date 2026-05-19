import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Loader2, 
  Navigation,
  Globe,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Map as MapIcon,
  Fingerprint
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
    <div className="max-w-5xl mx-auto space-y-12 pb-20 font-outfit">
      {/* Cinematic Identity Header */}
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="text-maroon-800 font-bold uppercase tracking-[0.5em] text-[10px] bg-maroon-50 px-5 py-2 rounded-full">
                 Institutional Access
               </span>
               <div className="h-px w-12 bg-maroon-100"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic">
              Spatial <span className="text-maroon-800">Identity</span>
            </h1>
            <p className="text-gray-400 font-medium italic text-lg max-w-2xl">
              Official geographic coordination and contact protocols for the administrative and institutional hub.
            </p>
          </div>

          <div className="relative bg-maroon-950 px-10 py-8 rounded-[2.5rem] shadow-2xl shadow-maroon-950/20 group/stat hover:bg-black transition-all duration-500 border border-white/5">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-maroon-500 border border-white/10 group-hover/stat:scale-110 transition-transform duration-500">
                   <MapPin size={28} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Status</p>
                   <p className="text-2xl font-bold text-white tracking-tighter font-['Playfair_Display'] italic">GPS Calibrated</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group/form">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/form:opacity-10 transition-opacity">
           <Compass size={150} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-16">
            <div className="w-16 h-16 bg-maroon-950 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-maroon-950/20 group-hover/form:rotate-12 transition-transform duration-700">
              <Settings size={32} />
            </div>
            <div>
               <h2 className="text-3xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] italic">Configuration Console</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Identity Protocol v1.2</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div className="group/input">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-3 group-focus-within/input:text-maroon-800 transition-colors">
                  <MapIcon size={16} className="text-maroon-800" /> Physical Address
                </label>
                <textarea 
                  value={data.address}
                  onChange={(e) => setData({...data, address: e.target.value})}
                  placeholder="Enter official institutional address..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] px-8 py-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all h-32 resize-none placeholder:text-gray-300"
                />
              </div>

              <div className="group/input">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-3 group-focus-within/input:text-maroon-800 transition-colors">
                  <Phone size={16} className="text-maroon-800" /> Contact Number
                </label>
                <input 
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({...data, phone: e.target.value})}
                  placeholder="Official mobile or landline..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-full px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-10">
              <div className="group/input">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-3 group-focus-within/input:text-maroon-800 transition-colors">
                  <Mail size={16} className="text-maroon-800" /> Official Email
                </label>
                <input 
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({...data, email: e.target.value})}
                  placeholder="institutional@domain.gov"
                  className="w-full bg-gray-50 border border-gray-100 rounded-full px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="group/input">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-3 group-focus-within/input:text-maroon-800 transition-colors">
                  <Clock size={16} className="text-maroon-800" /> Administrative Hours
                </label>
                <input 
                  type="text"
                  value={data.hours}
                  onChange={(e) => setData({...data, hours: e.target.value})}
                  placeholder="e.g. Mon - Fri • 7:30 - 4:30"
                  className="w-full bg-gray-50 border border-gray-100 rounded-full px-8 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col items-center">
            <button 
              type="submit"
              disabled={submitting}
              className="w-full max-w-2xl py-7 rounded-full bg-maroon-950 text-white font-bold uppercase tracking-[0.5em] text-[10px] flex items-center justify-center gap-6 transition-all duration-500 shadow-2xl shadow-maroon-950/20 hover:bg-black active:scale-95 group/submit disabled:opacity-20"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Fingerprint size={24} className="text-maroon-500" />
                  Authenticate & Commit Updates
                  <ArrowUpRight size={20} className="opacity-40 group-hover/submit:opacity-100 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-all" />
                </>
              )}
            </button>
            <p className="mt-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">
              * Changes will be propagated to the public-facing portal immediately.
            </p>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity duration-1000">
         <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
            <Globe size={18} className="text-maroon-800" /> Regional Synchronized
         </div>
         <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
         <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
            <Navigation size={18} className="text-maroon-800" /> Precise GPS Calibration
         </div>
         <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
         <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
            <ShieldCheck size={18} className="text-maroon-800" /> SSL Secure Data Transmission
         </div>
      </div>
    </div>
  );
};

export default AdminLocation;
