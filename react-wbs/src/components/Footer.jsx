import React from 'react';
import { Globe, Mail, MapPin, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import rectologo from '../assets/imgs/rectologo.png';
import depedquezon from '../assets/imgs/depedquezon.png';
import bagongpilipinas from '../assets/imgs/bagongpilipinas.png';
import schoolseal from '../assets/imgs/schoolseal.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-32 font-roboto overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-maroon-900/5 rounded-full -mr-96 -mt-96 blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 items-start">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex flex-wrap gap-8 items-center">
              <img src={rectologo} alt="RMNHS Logo" className="h-16 lg:h-20 object-contain hover:scale-110 transition-transform duration-500" />
              <img src={depedquezon} alt="DepEd Quezon Logo" className="h-16 lg:h-20 object-contain hover:scale-110 transition-transform duration-500" />
              <img src={bagongpilipinas} alt="Bagong Pilipinas Logo" className="h-16 lg:h-20 object-contain hover:scale-110 transition-transform duration-500" />
              <img src={schoolseal} alt="School Seal" className="h-16 lg:h-20 object-contain hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="max-w-md">
               <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 leading-none">
                 Recto Memorial <span className="text-maroon-800">National</span> High School
               </h2>
               <p className="text-gray-400 font-medium italic leading-relaxed text-sm">
                 Committed to nurturing Filipino learners who are passionately patriotic, value-driven, and globally competitive. Building a legacy of excellence since its foundation.
               </p>
            </div>

            <div className="flex items-center gap-6">
              {[
                { icon: <Globe size={20} />, href: "https://www.facebook.com/TheRectorianPress", bg: "hover:bg-blue-600" },
                { icon: <Mail size={20} />, href: "mailto:rectomns301380@gmail.com", bg: "hover:bg-red-600" },
                { icon: <MapPin size={20} />, href: "https://maps.google.com/?q=X85C+R5C,+Tiaong,+Quezon+Province", bg: "hover:bg-orange-600" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-maroon-800 shadow-sm transition-all transform hover:-translate-y-2 hover:text-white hover:shadow-2xl ${social.bg}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Development Unit */}
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-2 italic">
               <Sparkles size={14} className="text-maroon-800" /> System Architects
            </h3>
            <ul className="space-y-4">
              {['Catibog, S.', 'Lajara, J.', 'Magnaye, B.', 'Perez, K.', 'Pucyutan, L.', 'Salcedo, L.'].map((dev, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900 group">
                   <div className="w-1.5 h-1.5 rounded-full bg-maroon-800 opacity-0 group-hover:opacity-100 transition-all"></div>
                   <span className="group-hover:translate-x-2 transition-transform">{dev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact HQ */}
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-2 italic">
               <ShieldCheck size={14} className="text-maroon-800" /> Institutional HQ
            </h3>
            <div className="space-y-8">
               <div>
                  <p className="text-[10px] font-black text-maroon-800 uppercase tracking-widest mb-2">Physical Location</p>
                  <p className="text-xs font-bold text-gray-900 leading-relaxed uppercase italic tracking-tighter">
                    X85C+R5C, Quipot, Tiaong,<br />Quezon Province, 4325
                  </p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-maroon-800 uppercase tracking-widest mb-2">Direct Channel</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none">+63 949 995 1769</p>
               </div>
               <div className="pt-8 border-t border-gray-50 flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-xl shadow-green-500/50"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">System Status: Synchronized</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Strip */}
      <div className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-maroon-800 rounded-xl flex items-center justify-center font-black text-xs italic shadow-xl">RM</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
               &copy; {new Date().getFullYear()} Recto Memorial National High School. All Rights Reserved.
             </p>
          </div>
          <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-white/30">
             <a href="#" className="hover:text-maroon-500 transition-colors">Privacy Protocol</a>
             <a href="#" className="hover:text-maroon-500 transition-colors">Digital Ethics</a>
             <div className="flex items-center gap-2 text-white/10">
                Crafted with <Heart size={10} className="text-maroon-800 fill-maroon-800" /> by RMNS Dev Team
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
