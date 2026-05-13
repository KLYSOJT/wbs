import React from 'react';
import { MapPin, Navigation, Phone, Mail, Clock, Globe, ArrowUpRight, Compass } from 'lucide-react';

const Location = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-roboto">
      <header className="mb-20 text-center">
        <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Geographic Location</span>
        <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Find Our Campus</h1>
        <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Contact Information Panel */}
        <div className="lg:col-span-1 space-y-10">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-maroon-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-maroon-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-maroon-900/20">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-maroon-800 uppercase tracking-widest mb-2">Mailing Address</p>
                  <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">
                    X85C+R5C, Quipot, <br />
                    Tiaong, Quezon <br />
                    Philippines, 4325
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white border border-gray-100 text-maroon-900 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Direct Contact</p>
                  <p className="text-lg font-black text-gray-900 italic tracking-tighter">0949 995 1769</p>
                  <p className="text-xs font-medium text-gray-400 mt-1">Registrar & Admissions</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white border border-gray-100 text-maroon-900 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Digital Inquiry</p>
                  <p className="text-lg font-black text-gray-900 italic tracking-tighter line-clamp-1">rectomns301380@gmail.com</p>
                  <p className="text-xs font-medium text-gray-400 mt-1">General Correspondence</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white border border-gray-100 text-maroon-900 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Operating Hours</p>
                  <p className="text-lg font-black text-gray-900 italic tracking-tighter">Mon - Fri • 7:30 - 4:30</p>
                  <p className="text-xs font-medium text-gray-400 mt-1">Administrative Office Only</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-maroon-900 hover:bg-maroon-900 hover:text-white transition-all cursor-pointer">
                  <Globe size={18} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-maroon-900 hover:bg-maroon-900 hover:text-white transition-all cursor-pointer">
                  <Navigation size={18} />
                </div>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Official Contact v2</span>
            </div>
          </div>

          <div className="bg-maroon-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-maroon-900/30">
            <div className="absolute bottom-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-125 duration-1000">
               <Compass size={120} />
            </div>
            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4">Travel Directions</h4>
            <p className="text-sm font-medium text-white/70 leading-relaxed mb-8">
              RMNHS is located in the scenic town of Tiaong. Our campus is easily accessible via public transport or private vehicle from the Maharlika Highway.
            </p>
            <a 
              href="https://maps.google.com/?q=Recto+Memorial+National+High+School"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-maroon-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all"
            >
              Start Navigation <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Map Display Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[4rem] p-6 shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative h-[700px] group">
            <div className="absolute top-10 left-10 z-10">
               <span className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-100 shadow-xl text-[10px] font-black uppercase tracking-widest text-maroon-900 flex items-center gap-3 animate-bounce">
                  <MapPin size={14} /> Interactive Campus Map
               </span>
            </div>
            
            <div className="w-full h-full rounded-[3.5rem] overflow-hidden grayscale-[20%] hover:grayscale-0 transition-all duration-1000 border border-gray-50">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15485.45717320015!2d121.312918!3d13.931448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd455555555555%3A0x7d7d7d7d7d7d7d7d!2sRecto%20Memorial%20National%20High%20School!5e0!3m2!1sen!2sph!4v1715560000000!5m2!1sen!2sph" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location Map"
              ></iframe>
            </div>

            {/* Map Overlay Footer */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-4/5 bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-2xl transition-all group-hover:translate-y-2">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-maroon-50 rounded-2xl flex items-center justify-center text-maroon-900">
                        <Navigation size={20} />
                     </div>
                     <div>
                        <h5 className="font-black text-gray-900 uppercase italic tracking-tighter text-lg leading-none">Recto Memorial NHS</h5>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">X85C+R5C Tiaong, Quezon</p>
                     </div>
                  </div>
                  <button className="bg-maroon-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-maroon-800 transition-all shadow-xl shadow-maroon-900/20 active:scale-95">
                     View in Large Map
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
