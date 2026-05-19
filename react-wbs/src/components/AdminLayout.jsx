import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  LogOut, 
  Search,
  BookOpen,
  Home,
  Info,
  FolderOpen,
  Eye,
  Sparkles,
  Bell,
  ArrowUpRight,
  Activity,
  Globe,
  Terminal,
  CircleDot,
  Lock,
  ClipboardList
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
    { 
      title: 'Home', 
      icon: <Home size={20} />, 
      subItems: [
        { title: 'Announcement', path: '/admin/dashboard?section=announcement' },
        { title: 'News', path: '/admin/dashboard?section=news' },
        { title: 'Videos', path: '/admin/dashboard?section=videos' },
      ]
    },
    { 
      title: 'About', 
      icon: <Info size={20} />, 
      subItems: [
        { title: 'Organizational Structure', path: '/admin/organizational-structure' },
        { title: 'Recognized Structure', path: '/admin/recognized-organizations' },
      ]
    },
    { 
      title: 'Resources', 
      icon: <FolderOpen size={20} />, 
      subItems: [
        { title: 'School Memorandum', path: '/admin/memoranda?table=school_memorandum' },
        { title: 'Division Memorandum', path: '/admin/memoranda?table=division_memorandum' },
        { title: 'DepEd Memorandum', path: '/admin/memoranda?table=deped_memorandum' },
        { title: 'DepEd Order', path: '/admin/memoranda?table=deped_order' },
        { title: 'Learning Materials', path: '/admin/learning-materials' },
      ]
    },
    { 
      title: 'Transparency', 
      icon: <Eye size={20} />, 
      subItems: [
        {
          title: 'Procurement Bulletin',
          path: '/admin/transparency?table=app',
          icon: <ClipboardList size={14} />,
          subItems: [
            { title: 'APP', path: '/admin/transparency?table=app' },
            { title: 'Award of Contracts', path: '/admin/transparency?table=award_of_contracts' },
            { title: 'Bid and Awards Committee', path: '/admin/transparency?table=bac' },
            { title: 'Bid Bulletin', path: '/admin/transparency?table=bid_bulletin' },
            { title: 'Invitation to Bid', path: '/admin/transparency?table=invitation_to_bid' },
            { title: 'PhilGEPS', path: '/admin/transparency?table=philgeps' },
            { title: 'Procurement Reports', path: '/admin/transparency?table=procurement_reports' },
          ]
        },
        { title: 'SPTA', path: '/admin/transparency?table=spta' },
        { title: 'SSLG', path: '/admin/transparency?table=sslg' },
        { title: 'BSP', path: '/admin/transparency?table=bsp' },
        { title: 'GSP', path: '/admin/transparency?table=gsp' },
        { title: 'TR', path: '/admin/transparency?table=tr' },
        { title: 'MOOE', path: '/admin/transparency?table=mooe' },
        { title: 'Red Cross', path: '/admin/transparency?table=red_cross' },
      ]
    },
    { title: 'Research', path: '/admin/research', icon: <BookOpen size={20} /> },
  ];

  const currentPathName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  const currentRoute = `${location.pathname}${location.search}`;
  const isItemActive = (item) => {
    if (item.path && (currentRoute === item.path || (!item.path.includes('?') && location.pathname === item.path))) {
      return true;
    }
    return item.subItems?.some(isItemActive) || false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-outfit overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-[#3A0000] via-[#4A0000] to-black text-white flex flex-col fixed inset-y-0 z-50 shadow-2xl shadow-maroon-950/20 border-r border-white/10">
        {/* Sidebar Identity */}
        <div className="px-7 py-7 flex items-center gap-4 border-b border-white/10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
             <img src={logo} alt="RMNHS" className="w-9 h-9 object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight leading-none">RMNHS Admin</h1>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/50 mt-1">Quezon Province</p>
          </div>
        </div>

        {/* Management Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item, idx) => (
            <div key={idx} className="space-y-1 pb-3 last:pb-0">
              {item.subItems ? (
                <>
                  <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                    <span className={`${isItemActive(item) ? 'text-white' : 'text-white/45'}`}>{item.icon}</span>
                    <span className={`font-semibold uppercase tracking-[0.18em] text-[11px] ${isItemActive(item) ? 'text-white' : 'text-white/45'}`}>{item.title}</span>
                  </div>
                  {item.subItems.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <Link
                        to={sub.path}
                        className={`
                          flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group
                          ${isItemActive(sub) 
                            ? 'bg-white text-maroon-900 shadow-sm' 
                            : 'text-white/70 hover:bg-white/10 hover:text-white'}
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {sub.icon || <CircleDot size={9} className={`shrink-0 ${isItemActive(sub) ? 'text-maroon-700' : 'text-white/25 group-hover:text-white/70'}`} />}
                          <span className="font-medium text-[13px] leading-tight truncate">{sub.title}</span>
                        </div>
                        {isItemActive(sub) && (
                           <div className="w-1.5 h-1.5 rounded-full bg-maroon-700 shrink-0"></div>
                        )}
                      </Link>
                      {sub.subItems && (
                        <div className="ml-5 pl-3 border-l border-white/10 space-y-1">
                          {sub.subItems.map((child, cIdx) => (
                            <Link
                              key={cIdx}
                              to={child.path}
                              className={`
                                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group/child
                                ${isItemActive(child)
                                  ? 'text-white bg-white/15'
                                  : 'text-white/55 hover:text-white hover:bg-white/10'}
                              `}
                            >
                              <CircleDot size={7} className={`shrink-0 ${isItemActive(child) ? 'text-white' : 'text-white/20 group-hover/child:text-white/70'}`} />
                              <span className="font-medium text-[12px] leading-tight">{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                    ${isItemActive(item) 
                      ? 'bg-white text-maroon-900 shadow-sm' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <span className={`${isItemActive(item) ? 'text-maroon-800' : 'text-white/55 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-[13px]">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar User */}
        <div className="p-5 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl mb-3 border border-white/10">
            <div className="w-10 h-10 bg-white text-maroon-900 rounded-xl flex items-center justify-center font-bold text-base shrink-0">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{user?.email?.split('@')?.[0] || 'Admin'}</p>
              <div className="flex items-center gap-1.5 mt-0.5 text-white/45">
                 <Lock size={11} />
                 <p className="text-[10px] font-medium uppercase tracking-widest">Admin access</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 text-white/75 hover:bg-white hover:text-maroon-900 transition-all duration-300 font-semibold text-sm border border-white/10"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 ml-80 min-h-screen flex flex-col relative">
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-maroon-50 rounded-2xl flex items-center justify-center text-maroon-800 border border-maroon-100">
               <Terminal size={20} />
            </div>
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <Activity size={10} className="text-maroon-800" />
                  <h2 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400 leading-none">Admin panel</h2>
               </div>
               <p className="text-2xl font-bold text-gray-900 tracking-tight leading-none capitalize">
                 {currentPathName}
               </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-full border border-gray-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-maroon-50 focus-within:border-maroon-200 transition-all group">
              <Search className="text-gray-400 group-focus-within:text-maroon-800 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search admin..." 
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 w-64"
              />
            </div>
            
            <button className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-maroon-900 hover:border-maroon-100 hover:bg-maroon-50 transition-all relative">
              <Bell size={19} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-maroon-600 rounded-full border-2 border-white"></span>
            </button>
            <Link 
              to="/" 
              target="_blank" 
              className="flex items-center gap-2 bg-gradient-to-r from-[#3A0000] via-[#4A0000] to-black text-white px-5 py-3 rounded-full text-[12px] font-semibold hover:shadow-lg hover:shadow-maroon-950/20 transition-all"
            >
              <Sparkles size={15} /> View Site <ArrowUpRight size={16} className="opacity-70" />
            </Link>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="p-8 flex-1 relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {children}
          </div>
        </div>

        <footer className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-white">
           <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              <div className="w-2 h-2 rounded-full bg-maroon-800"></div>
              RMNHS Admin
           </div>
           <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span className="text-[11px] font-semibold text-green-700">Online</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                 <Globe size={14} />
                 2026
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
