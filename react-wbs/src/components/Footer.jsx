import { Phone, Mail, MapPin } from 'lucide-react';
import rectologo from '../assets/imgs/rectologo.png';
import depedquezon from '../assets/imgs/depedquezon.png';
import bagongpilipinas from '../assets/imgs/bagongpilipinas.png';
import schoolseal from '../assets/imgs/schoolseal.png';

const Footer = () => {
  return (
    <footer className="bg-white font-outfit border-t border-gray-100">
      <div className="user-screen-container py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <img src={rectologo} alt="RMNHS" className="h-12 w-auto" />
               <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight">RMNHS</span>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Quezon Province</span>
               </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Recto Memorial National High School is a premier educational institution dedicated to fostering academic excellence and character development in Quezon Province.
            </p>
            <div className="flex gap-4">
              {[
                { 
                  icon: <svg size={18} viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, 
                  color: 'bg-blue-50 text-blue-600 ring-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-blue-200',
                  href: 'https://www.facebook.com/TheRectorianPress',
                  label: 'Facebook'
                },
                { 
                  icon: <svg size={18} viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><path fill="white" d="M9.75 15.02V8.48l5.75 3.27-5.75 3.27z"></path></svg>, 
                  color: 'bg-red-50 text-red-600 ring-red-100 hover:bg-red-600 hover:text-white hover:shadow-red-200',
                  href: 'https://www.youtube.com/@TheRectorianPress',
                  label: 'YouTube'
                },
                { 
                  icon: <svg size={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>, 
                  color: 'bg-pink-50 text-pink-600 ring-pink-100 hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 hover:text-white hover:shadow-pink-200',
                  label: 'Instagram'
                },
                { 
                  icon: <svg size={18} viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>, 
                  color: 'bg-sky-50 text-sky-500 ring-sky-100 hover:bg-sky-500 hover:text-white hover:shadow-sky-200',
                  label: 'Twitter'
                }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href || '#'}
                  aria-label={social.label || 'Social link'}
                  target={social.href ? '_blank' : undefined}
                  rel={social.href ? 'noopener noreferrer' : undefined}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ring-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Resources', 'Transparency Information', 'Research', 'Location'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 hover:text-maroon-800 transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-maroon-800 transition-all group-hover:w-3"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Team Column */}
          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Our Team</h3>
            <ul className="grid grid-cols-2 gap-4">
              {['Catibog, S.', 'Lajara, J.', 'Magnaye, B.', 'Perez, K.', 'Pucyutan, L.', 'Salcedo, L.'].map((name) => (
                <li key={name} className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">{name}</li>
              ))}
            </ul>
            <div className="pt-4 border-t border-gray-50">
               <div className="flex items-center gap-3">
                  <div className="flex h-14 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
                     <img src={depedquezon} alt="DepEd" className="max-h-10 w-auto object-contain" />
                  </div>
                  <div className="flex h-14 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
                     <img src={bagongpilipinas} alt="Bagong Pilipinas" className="max-h-10 w-auto object-contain" />
                  </div>
                  <div className="flex h-14 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
                     <img src={schoolseal} alt="Seal" className="max-h-10 w-auto object-contain" />
                  </div>
               </div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Contact Us</h3>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-maroon-50 flex items-center justify-center text-maroon-800 flex-shrink-0">
                     <MapPin size={20} />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                    Quipot, Tiaong, <br /> Quezon Province 4325
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-maroon-50 flex items-center justify-center text-maroon-800 flex-shrink-0">
                     <Phone size={20} />
                  </div>
                  <p className="text-sm font-bold text-gray-700 tracking-tight">+63 949 995 1769</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-maroon-50 flex items-center justify-center text-maroon-800 flex-shrink-0">
                     <Mail size={20} />
                  </div>
                  <p className="text-sm font-bold text-gray-700 tracking-tight">rectomns301380@gmail.com</p>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-50 py-10">
         <div className="user-screen-container flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} Recto Memorial National High School • All Rights Reserved
            </p>
            <div className="flex gap-10 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
               <a href="#" className="hover:text-maroon-800 transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-maroon-800 transition-colors">Terms of Service</a>
            </div>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
