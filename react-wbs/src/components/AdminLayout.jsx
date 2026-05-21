import { useEffect, useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
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
  Menu,
  X,
  ChevronDown,
  CircleDot,
  Lock,
  ClipboardList,
  Moon,
  Sun
} from 'lucide-react';
import logo from '../assets/imgs/rectologo.png';

const AdminLayout = ({ children }) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('admin-theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('admin-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
              <p className="text-gray-900 font-bold uppercase tracking-[0.45em] text-[11px]">Loading Admin Portal</p>
           </div>
           <p className="text-gray-400 text-[10px] uppercase tracking-[0.28em] opacity-70">Preparing website management tools</p>
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
    {
      title: 'Research',
      icon: <BookOpen size={20} />,
      subItems: [
        { title: 'Research Archive', path: '/admin/research' },
      ]
    },
  ];

  const currentPathName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  const currentRoute = `${location.pathname}${location.search}`;
  const isItemActive = (item) => {
    if (item.path && (currentRoute === item.path || (!item.path.includes('?') && location.pathname === item.path))) {
      return true;
    }
    return item.subItems?.some(isItemActive) || false;
  };
  const isSectionOpen = (item) => openSections[item.title] ?? isItemActive(item);
  const toggleSection = (item) => {
    setOpenSections((current) => ({
      ...current,
      [item.title]: !(current[item.title] ?? isItemActive(item))
    }));
  };

  return (
    <div className={`admin-shell min-h-screen bg-[#f7f7f5] font-outfit text-gray-950 ${darkMode ? 'admin-dark' : ''}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-gray-950/45 lg:hidden"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[16.5rem] max-w-[82vw] flex-col overflow-hidden border-r border-black/5 bg-[linear-gradient(180deg,#f3f1ed_0%,#ebe7df_54%,#dfd8cd_100%)] text-gray-950 shadow-2xl shadow-gray-950/10 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Identity */}
        <div className="relative flex min-h-20 items-center border-b border-black/5 px-4 py-3">
          <div className="flex items-center gap-3">
          <img src={logo} alt="RMNHS" className="h-12 w-12 shrink-0 object-contain" />
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-none tracking-tight text-gray-950">RMNHS Admin</h1>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-maroon-800/60">School Website </p>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-white text-gray-600 lg:hidden"
            aria-label="Close admin menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={17} />
          </button>
          </div>
          <div className="absolute bottom-0 left-4 h-1 w-16 rounded-full bg-maroon-800" />
        </div>

        {/* Management Navigation */}
        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleSection(item)}
                className={`
                  group flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all duration-300
                  ${isItemActive(item)
                    ? 'bg-maroon-800 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-white/75 hover:text-maroon-900'}
                `}
                aria-expanded={isSectionOpen(item)}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={`${isItemActive(item) ? 'text-white' : 'text-gray-400 group-hover:text-maroon-800'} [&_svg]:h-4 [&_svg]:w-4`}>
                    {item.icon}
                  </span>
                  <span className="truncate text-[13px] font-semibold">{item.title}</span>
                </span>
                <ChevronDown
                  size={15}
                className={`shrink-0 transition-transform duration-300 ${isSectionOpen(item) ? 'rotate-180' : ''}`}
                />
              </button>

              {isSectionOpen(item) && (
                <div className="space-y-1 pl-2.5">
                  {item.subItems.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <Link
                        to={sub.path}
                        className={`
                          group flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all duration-200
                          ${isItemActive(sub) 
                            ? 'border-maroon-100 bg-white text-maroon-950 shadow-sm' 
                            : 'border-transparent text-gray-600 hover:bg-white/75 hover:text-gray-950'}
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {sub.icon || <CircleDot size={8} className={`shrink-0 ${isItemActive(sub) ? 'text-maroon-800' : 'text-gray-300 group-hover:text-maroon-700'}`} />}
                          <span className="font-medium text-[12px] leading-tight truncate">{sub.title}</span>
                        </div>
                        {isItemActive(sub) && (
                           <div className="h-5 w-1 shrink-0 rounded-full bg-maroon-800"></div>
                        )}
                      </Link>
                      {sub.subItems && (
                        <div className="ml-4 space-y-1 border-l border-black/10 py-1 pl-2.5">
                          {sub.subItems.map((child, cIdx) => (
                            <Link
                              key={cIdx}
                              to={child.path}
                              className={`
                                group/child flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-200
                                ${isItemActive(child)
                                  ? 'bg-white text-maroon-950'
                                  : 'text-gray-500 hover:bg-white/75 hover:text-gray-900'}
                              `}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <CircleDot size={7} className={`shrink-0 ${isItemActive(child) ? 'text-maroon-800' : 'text-gray-300 group-hover/child:text-maroon-700'}`} />
                              <span className="font-medium text-[11px] leading-tight">{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar User */}
        <div className="border-t border-black/5 bg-black/[0.03] p-4">
          <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-black/5 bg-white/70 p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-maroon-800 text-sm font-bold text-white">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-gray-950">{user?.email?.split('@')?.[0] || 'Admin'}</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-gray-400">
                 <Lock size={11} />
                 <p className="text-[10px] font-medium uppercase tracking-widest">Admin access</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/5 bg-white/70 py-2.5 text-xs font-semibold text-gray-600 transition-all duration-200 hover:bg-white hover:text-maroon-900"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
        <main className="relative flex min-h-screen flex-col lg:ml-[16.5rem]">
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-black/5 bg-[#f7f7f5]/90 px-4 py-3 shadow-sm shadow-gray-950/[0.03] backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white text-gray-600 shadow-sm lg:hidden"
              aria-label="Open admin menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <Activity size={10} className="text-maroon-800" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.24em] text-maroon-800/70 leading-none">Website management</h2>
               </div>
               <p className="text-2xl font-bold text-gray-900 tracking-tight leading-none capitalize">
                 {currentPathName}
               </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 rounded-full border border-black/5 bg-white px-4 py-2.5 shadow-sm transition-all focus-within:border-maroon-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-maroon-50 xl:flex">
              <Search className="text-gray-400 group-focus-within:text-maroon-800 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search admin..." 
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 w-64"
              />
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-gray-500 shadow-sm transition-all hover:border-maroon-100 hover:bg-maroon-50 hover:text-maroon-900"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <button className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-gray-500 shadow-sm transition-all hover:border-maroon-100 hover:bg-maroon-50 hover:text-maroon-900 sm:flex">
              <Bell size={19} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-maroon-600 rounded-full border-2 border-white"></span>
            </button>
            <Link 
              to="/" 
              target="_blank" 
              className="flex items-center gap-2 rounded-full bg-maroon-800 px-4 py-3 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-maroon-900 md:px-5"
            >
              <Sparkles size={15} /> <span className="hidden sm:inline">View Site</span> <ArrowUpRight size={16} className="opacity-70" />
            </Link>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="relative z-10 flex-1 p-4 md:p-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {children}
          </div>
        </div>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-black/5 bg-white px-8 py-6 md:flex-row">
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
