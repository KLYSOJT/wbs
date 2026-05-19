import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut, 
  Search,
  BookOpen,
  MapPin,
  Sparkles,
  Bell,
  Database,
  ArrowUpRight,
  Shield,
  Activity,
  Cpu,
  Globe,
  Terminal,
  CircleDot,
  Lock
} from 'lucide-react';
import logo from '../assets/imgs/rectologo.png';

const AdminLayout = ({ children }) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-12 bg-white font-outfit overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(128,0,0,0.02),transparent_70%)] animate-pulse"></div>
        <div className="relative">
           <div className="w-32 h-32 border-[3px] border-maroon-800/5 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 border-[3px] border-maroon-800/10 rounded-full flex items-center justify-center animate-[spin_3s_linear_infinite]">
                 <div className="w-16 h-16 border-[3px] border-maroon-800 border-t-transparent rounded-full animate-spin"></div>
              </div>
           </div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <img src={logo} alt="Logo" className="w-10 h-10 grayscale opacity-20" />
           </div>
        </div>
        <div className="text-center space-y-4 relative z-10">
           <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-maroon-800 animate-ping"></div>
              <p className="text-gray-900 font-bold uppercase tracking-[0.6em] text-[11px]">Initializing Secure Shell</p>
           </div>
           <p className="text-gray-400 text-[9px] uppercase tracking-[0.4em] italic opacity-60">Synchronizing Institutional Mainframe...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { title: 'Command Center', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { 
      title: 'Institutional', 
      icon: <Users size={20} />, 
      subItems: [
        { title: 'Personnel Directory', path: '/admin/organizational-structure' },
        { title: 'Student Organizations', path: '/admin/recognized-organizations' },
      ]
    },
    { 
      title: 'Vault Repository', 
      icon: <Database size={20} />, 
      subItems: [
        { title: 'Memoranda Archive', path: '/admin/memoranda' },
        { title: 'Academic Repository', path: '/admin/learning-materials' },
      ]
    },
    { title: 'Research & Innovation', path: '/admin/research', icon: <BookOpen size={20} /> },
    { title: 'Spatial Identity', path: '/admin/location', icon: <MapPin size={20} /> },
    { title: 'Compliance Portal', path: '/admin/transparency', icon: <Shield size={20} /> },
  ];

  const currentPathName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-outfit overflow-hidden">
      {/* Cinematic Sidebar: Command Interface */}
      <aside className="w-85 bg-gray-950 text-white flex flex-col fixed inset-y-0 z-50 shadow-[0_0_100px_rgba(0,0,0,0.4)] border-r border-white/5">
        {/* Sidebar Identity: RMNS HQ */}
        <div className="p-12 pb-16 flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(128,0,0,0.15),transparent_70%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl relative z-10 transition-transform duration-700 group-hover:rotate-12">
             <img src={logo} alt="RMNHS" className="w-12 h-12 object-contain grayscale brightness-200" />
          </div>
          <div className="relative z-10">
            <h1 className="font-bold text-3xl tracking-tighter font-['Playfair_Display'] italic leading-none group-hover:text-maroon-500 transition-colors">
              RMNS <span className="text-maroon-600">HQ</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 opacity-30">
               <div className="w-1.5 h-1.5 rounded-full bg-maroon-500"></div>
               <p className="text-[10px] font-bold uppercase tracking-[0.4em] italic">Command Unit</p>
            </div>
          </div>
        </div>

        {/* Management Navigation: Recursive Hierarchy */}
        <nav className="flex-1 px-8 py-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
          {navItems.map((item, idx) => (
            <div key={idx} className="space-y-2 mb-8 last:mb-0">
              {item.subItems ? (
                <>
                  <div className="flex items-center justify-between px-6 mb-4">
                    <span className="text-white/20 font-bold uppercase tracking-[0.4em] text-[9px]">{item.title}</span>
                    <div className="h-px w-8 bg-white/5"></div>
                  </div>
                  {item.subItems.map((sub, sIdx) => (
                    <Link
                      key={sIdx}
                      to={sub.path}
                      className={`
                        flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden
                        ${location.pathname === sub.path 
                          ? 'bg-maroon-950/80 backdrop-blur-md text-white shadow-[0_20px_40px_-15px_rgba(128,0,0,0.3)] border border-white/5 translate-x-2' 
                          : 'text-white/40 hover:bg-white/5 hover:text-white hover:translate-x-1'}
                      `}
                    >
                      <div className="flex items-center gap-5 relative z-10">
                        <CircleDot size={12} className={`transition-all duration-700 ${location.pathname === sub.path ? 'text-maroon-500 scale-125' : 'text-white/10 group-hover:text-maroon-500'}`} />
                        <span className="font-bold tracking-tight text-[13px]">{sub.title}</span>
                      </div>
                      {location.pathname === sub.path && (
                         <div className="w-2 h-2 rounded-full bg-maroon-600 animate-pulse relative z-10"></div>
                      )}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden
                    ${location.pathname === item.path 
                      ? 'bg-maroon-950/80 backdrop-blur-md text-white shadow-[0_20px_40px_-15px_rgba(128,0,0,0.3)] border border-white/5 translate-x-2' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white hover:translate-x-1'}
                  `}
                >
                  <span className={`transition-all duration-500 relative z-10 ${location.pathname === item.path ? 'text-maroon-500 scale-110' : 'text-white/10 group-hover:text-maroon-500 group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="font-bold tracking-tight text-[13px] relative z-10">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Authority Profile: Secure Entry */}
        <div className="p-10 border-t border-white/5 bg-black/40 relative">
          <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[2rem] mb-8 border border-white/5 group hover:bg-white/10 transition-all cursor-default relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
               <Shield size={80} />
            </div>
            <div className="w-14 h-14 bg-maroon-900 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl border border-white/5 relative z-10">
              {user?.email?.[0]?.toUpperCase()}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-[4px] border-black shadow-lg"></div>
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <p className="text-[14px] font-bold truncate text-white/90">{user?.email?.split('@')?.[0] || 'Admin'}</p>
              <div className="flex items-center gap-2 mt-1 opacity-40">
                 <Lock size={10} className="text-maroon-500" />
                 <p className="text-[9px] font-bold uppercase tracking-widest italic">Auth Protocol v2</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-4 py-5 rounded-[1.5rem] bg-white/5 text-white/30 hover:bg-red-950 hover:text-white transition-all duration-500 font-bold uppercase tracking-[0.4em] text-[10px] group border border-white/5 shadow-2xl"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> Access Termination
          </button>
        </div>
      </aside>

      {/* Main Operations Area: Real-time Context */}
      <main className="flex-1 ml-85 min-h-screen flex flex-col relative">
        {/* Architectural Canvas */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(128,0,0,0.035)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Glassmorphic Header: Path Identity */}
        <header className="h-28 bg-white/80 backdrop-blur-3xl border-b border-gray-100 flex items-center justify-between px-16 sticky top-0 z-40">
          <div className="flex items-center gap-10">
            <div className="w-16 h-16 bg-gray-950 rounded-3xl flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-white/10 group transition-transform hover:scale-105">
               <Terminal size={28} className="text-maroon-500" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <Activity size={12} className="text-maroon-800 animate-pulse" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-gray-300 leading-none">Command context</h2>
               </div>
               <p className="text-4xl font-bold text-gray-900 tracking-tighter leading-none font-['Playfair_Display'] italic capitalize">
                 {currentPathName}
               </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-5 px-8 py-4 bg-gray-50/80 rounded-full border border-gray-100 focus-within:bg-white focus-within:ring-[12px] focus-within:ring-maroon-50 focus-within:border-maroon-800/20 transition-all duration-700 shadow-inner group">
              <Search className="text-gray-300 group-focus-within:text-maroon-800 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Query system mainframe..." 
                className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 w-80"
              />
            </div>
            
            <div className="flex items-center gap-6">
               <button className="w-16 h-16 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-maroon-950 hover:shadow-2xl transition-all duration-500 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(128,0,0,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Bell size={24} className="group-hover:rotate-12 transition-transform relative z-10" />
                  <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-maroon-600 rounded-full border-[3px] border-white shadow-lg relative z-10"></span>
               </button>
               <Link 
                to="/" 
                target="_blank" 
                className="flex items-center gap-4 bg-maroon-950 text-white px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-maroon-950/30 group/portal"
              >
                <Sparkles size={16} className="text-maroon-500" /> Global Portal <ArrowUpRight size={18} className="opacity-40 group-hover/portal:opacity-100 group-hover/portal:translate-x-1 group-hover/portal:-translate-y-1 transition-all" />
              </Link>
            </div>
          </div>
        </header>

        {/* Content Viewport: Operations Layer */}
        <div className="p-16 flex-1 relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 cubic-bezier(0.4, 0, 0.2, 1)">
             {children}
          </div>
        </div>

        {/* Operations Footer: System Protocol */}
        <footer className="px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-gray-50/50 bg-white/30 backdrop-blur-md">
           <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300 italic">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-maroon-800 animate-pulse"></div>
                 RMNS HQ v2.8.4
              </div>
              <div className="h-4 w-px bg-gray-100"></div>
              <div className="flex items-center gap-3">
                 <Cpu size={14} className="opacity-40" />
                 Operational Efficiency: 99.9%
              </div>
           </div>
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4 px-6 py-3 bg-green-50/50 rounded-full border border-green-100/50">
                 <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                 <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">System Synchronized</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-200 uppercase tracking-widest group cursor-default">
                 <Globe size={14} className="group-hover:rotate-180 transition-transform duration-1000" />
                 Institutional Registry 2026
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
