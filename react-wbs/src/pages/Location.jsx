import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Navigation, Phone, Mail, Clock, Globe, ArrowUpRight, Compass, Loader2, Landmark } from 'lucide-react';

const Location = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    address: 'X85C+R5C, Quipot, Tiaong, Quezon',
    phone: '0949 995 1769',
    email: 'rectomns301380@gmail.com',
    hours: 'Mon - Fri • 7:30 - 4:30',
    map_url: ''
  });

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const { data: res, error } = await supabase
          .from('school_config')
          .select('*')
          .eq('key', 'location_info')
          .single();
        
        if (res) setData(res.value);
      } catch (err) {
        console.error('Error fetching location info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Geographic Location
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Campus
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Location
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Information Bento */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-maroon-50/50 rounded-full -mr-16 -mt-16 transition-transform duration-1000 group-hover:scale-110 pointer-events-none"></div>
              
              <div className="relative z-10 space-y-12">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-maroon-800" size={32} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Synchronizing...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-8">
                      <div className="w-16 h-16 bg-maroon-950 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-maroon-900/20 transition-transform duration-700 group-hover:rotate-6">
                        <MapPin size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-maroon-800 uppercase tracking-widest mb-3">Mailing Address</p>
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight font-['Playfair_Display'] italic">
                          {data.address}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                      <div className="flex items-start gap-6 group/item">
                        <div className="w-12 h-12 bg-gray-50 text-maroon-900 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover/item:bg-maroon-950 group-hover/item:text-white transition-all duration-500">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Direct Line</p>
                          <p className="text-lg font-bold text-gray-900 font-['Playfair_Display'] italic">{data.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-6 group/item">
                        <div className="w-12 h-12 bg-gray-50 text-maroon-900 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover/item:bg-maroon-950 group-hover/item:text-white transition-all duration-500">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Digital Mail</p>
                          <p className="text-lg font-bold text-gray-900 font-['Playfair_Display'] italic break-all">{data.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-6 group/item">
                        <div className="w-12 h-12 bg-gray-50 text-maroon-900 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover/item:bg-maroon-950 group-hover/item:text-white transition-all duration-500">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Operating Hours</p>
                          <p className="text-lg font-bold text-gray-900 font-['Playfair_Display'] italic">{data.hours}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-maroon-950 hover:bg-maroon-950 hover:text-white transition-all duration-500 cursor-pointer border border-gray-100 shadow-sm">
                    <Globe size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-maroon-950 hover:bg-maroon-950 hover:text-white transition-all duration-500 cursor-pointer border border-gray-100 shadow-sm">
                    <Navigation size={18} />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Public Registry 2024</span>
              </div>
            </div>

            <div className="bg-maroon-950 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-maroon-900/40">
              <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] transition-transform group-hover:scale-125 duration-1000 pointer-events-none">
                 <Compass size={180} />
              </div>
              <h4 className="text-2xl font-bold uppercase tracking-tighter mb-4 font-['Playfair_Display'] italic text-maroon-400">Navigation Guide</h4>
              <p className="text-sm font-medium text-white/60 leading-relaxed mb-10 italic">
                Recto Memorial National High School is situated in the municipality of Tiaong. Easily accessible via public transport from the Maharlika Highway.
              </p>
              <a 
                href={data.map_url || "https://maps.google.com/?q=Recto+Memorial+National+High+School"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-white text-maroon-950 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all duration-500 group/btn"
              >
                Launch Map Directions <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Interactive Map Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[4rem] p-8 shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative h-[780px] group">
              <div className="absolute top-12 left-12 z-20">
                 <span className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-2xl border border-gray-100 shadow-2xl text-[11px] font-bold uppercase tracking-widest text-maroon-950 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-maroon-800 animate-ping"></div>
                    Satellite View Interface
                 </span>
              </div>
              
              <div className="w-full h-full rounded-[3.5rem] overflow-hidden grayscale-[30%] hover:grayscale-0 transition-all duration-1000 border border-gray-50 shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15485.45717320015!2d121.312918!3d13.931448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd455555555555%3A0x7d7d7d7d7d7d7d7d!2sRecto%20Memorial%20National%20High%20School!5e0!3m2!1sen!2sph!4v1715560000000!5m2!1sen!2sph" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Campus Location"
                ></iframe>
              </div>

              {/* Map Footer Overlay */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 border border-white shadow-2xl transition-all duration-700 group-hover:translate-y-2">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-maroon-50 rounded-[1.5rem] flex items-center justify-center text-maroon-950 shadow-inner">
                          <Landmark size={28} />
                       </div>
                       <div>
                          <h5 className="font-bold text-gray-900 tracking-tighter text-2xl font-['Playfair_Display'] italic leading-none">The Recto Memorial Campus</h5>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{data.address}</p>
                       </div>
                    </div>
                    <a 
                      href={data.map_url || "https://maps.google.com/?q=Recto+Memorial+National+High+School"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-maroon-950 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all shadow-xl shadow-maroon-900/20 active:scale-95 inline-block text-center whitespace-nowrap"
                    >
                       Expand Large Map
                    </a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;

