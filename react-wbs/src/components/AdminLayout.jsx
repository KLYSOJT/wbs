import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Search,
  BookOpen,
  MapPin,
  Image as ImageIcon,
  Video,
  Sparkles,
  Command,
  Bell
} from 'lucide-react';
import logo from '../assets/imgs/rectologo.png';

const AdminLayout = ({ children }) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <div className="w-16 h-16 border-4 border-maroon-800 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Synchronizing Secure Shell...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { title: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { title: 'Institutional', icon: <Users size={20} />, subItems: [
      { title: 'Org Structure', path: '/admin/organizational-structure' },
      { title: 'Recognized Orgs', path: '/admin/recognized-organizations' },
    ]},
    { title: 'Documentation', icon: <FileText size={20} />, subItems: [
      { title: 'Memoranda', path: '/admin/memoranda' },
      { title: 'Learning Materials', path: '/admin/learning-materials' },
    ]},
    { title: 'Transparency', path: '/admin/transparency', icon: <ShieldCheck size={20} /> },
    { title: 'Research', path: '/admin/research', icon: <BookOpen size={20} /> },
    { title: 'Geographic', path: '/admin/location', icon: <MapPin size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-roboto overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-900 text-white flex flex-col fixed inset-y-0 z-50 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
        {/* Sidebar Header */}
        <div className="p-10 flex items-center gap-4 border-b border-white/5">
          <div className="w-12 h-12 bg-maroon-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-maroon-600/20">
             <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="font-black italic uppercase tracking-tighter text-2xl leading-none">
              RMNS <span className="text-maroon-500">HQ</span>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">Command Unit</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-10 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.subItems ? (
                <>
                  <div className="flex items-center justify-between px-4 py-3 text-white/20 font-black uppercase tracking-[0.2em] text-[10px] mt-8 mb-2">
                    {item.title}
                  </div>
                  {item.subItems.map((sub, sIdx) => (
                    <Link
                      key={sIdx}
                      to={sub.path}
                      className={`
                        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative
                        ${location.pathname === sub.path ? 'bg-maroon-600 text-white shadow-2xl shadow-maroon-600/30' : 'text-white/40 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <ChevronRight size={14} className={`transition-all ${location.pathname === sub.path ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                      <span className="font-black uppercase italic tracking-tighter text-sm">{sub.title}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group
                    ${location.pathname === item.path ? 'bg-maroon-600 text-white shadow-2xl shadow-maroon-600/30' : 'text-white/40 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <span className={`${location.pathname === item.path ? 'text-white' : 'text-white/20 group-hover:text-white'} transition-colors`}>{item.icon}</span>
                  <span className="font-black uppercase italic tracking-tighter text-sm">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl mb-6 border border-white/5">
            <div className="w-12 h-12 bg-maroon-800 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">{user.email?.split('@')[0]}</p>
              <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-0.5 italic">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] active:scale-95"
          >
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 min-h-screen flex flex-col relative">
        {/* Background Design Element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-maroon-900/5 rounded-full -mr-72 -mt-72 blur-3xl pointer-events-none"></div>

        {/* Sticky Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-maroon-800 shadow-inner">
               <Command size={20} />
            </div>
            <div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 leading-none mb-1">Current Active Module</h2>
               <p className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                 {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
               </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-4 px-6 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner group focus-within:ring-4 focus-within:ring-maroon-50 transition-all">
              <Search className="text-gray-300 group-focus-within:text-maroon-800 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Global command search..." 
                className="bg-transparent border-none outline-none text-xs font-bold text-gray-900 placeholder:text-gray-300 w-64"
              />
            </div>
            
            <div className="flex items-center gap-4">
               <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-maroon-800 hover:shadow-xl transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-maroon-600 rounded-full border-2 border-white"></span>
               </button>
               <Link 
                to="/" 
                target="_blank" 
                className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-maroon-900 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
              >
                <Sparkles size={14} /> Public Portal
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-12 flex-1 relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
             {children}
          </div>
        </div>

        {/* Footer Info */}
        <footer className="p-12 pt-0 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
           <span>RMNS Secure Management Protocol v2.5.0</span>
           <span className="flex items-center gap-2 italic">Synchronized with Mainframe <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></span>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
