import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, UserRound } from 'lucide-react';
import logo from '../assets/imgs/rectologo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const showDarkNavbar = scrolled;

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const nextScrolled = window.scrollY > 24;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { title: 'Home', path: '/' },
    {
      title: 'About',
      path: '#',
      dropdown: [
        { title: 'Organizational Structure', path: '/about/organizational-structure' },
        { title: 'Recognized Organization', path: '/about/recognized-organizations' },
        { title: 'Historical Profile', path: '/about/history' },
        { title: 'Vision & Mission', path: '/about/vmc' },
      ],
    },
    {
      title: 'Resources',
      path: '#',
      dropdown: [
        { title: 'School Memos', path: '/resources/school-memorandum' },
        { title: 'Division Memos', path: '/resources/division-memorandum' },
        { title: 'DepEd Memos', path: '/resources/deped-memorandum' },
        { title: 'DepEd Order', path: '/resources/deped-order' },
        {
          title: 'Learning Modules',
          path: '#',
          submenu: [
            { title: 'Grade 7', path: '/resources/grade-7' },
            { title: 'Grade 8', path: '/resources/grade-8' },
            { title: 'Grade 9', path: '/resources/grade-9' },
            { title: 'Grade 10', path: '/resources/grade-10' },
          ],
        },
      ],
    },
    {
      title: 'Transparency',
      path: '#',
      dropdown: [
        { title: 'Transparency Information', path: '/transparency/info' },
        {
          title: 'Procurement',
          path: '#',
          submenu: [
            { title: 'APP Archive', path: '/transparency/app' },
            { title: 'Contracts', path: '/transparency/award-contracts' },
            { title: 'BAC Records', path: '/transparency/bac' },
            { title: 'Bid Bulletins', path: '/transparency/bid-bulletin' },
            { title: 'Invitations', path: '/transparency/invitation-to-bid' },
            { title: 'PhilGEPS', path: '/transparency/philgeps' },
            { title: 'Reports', path: '/transparency/procurement-reports' },
          ],
        },
        { title: 'SPTA', path: '/transparency/spta' },
        { title: 'SSLG', path: '/transparency/sslg' },
        { title: 'BSP Records', path: '/transparency/bsp' },
        { title: 'GSP Records', path: '/transparency/gsp' },
        { title: 'TR', path: '/transparency/tr' },
        { title: 'Red Cross', path: '/transparency/red-cross' },
        { title: 'MOOE', path: '/transparency/mooe' },
      ],
    },
    { title: 'Research', path: '/research' },
    { title: 'Location', path: '/location' },
  ];

  const toggleDropdown = (title) => {
    if (window.innerWidth <= 1024) {
      setActiveDropdown(activeDropdown === title ? null : title);
    }
  };

  return (
    <nav className={`
      fixed top-0 z-[100] w-full overflow-visible font-outfit transition-[padding,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
      ${showDarkNavbar ? 'py-3.5' : 'py-7'}
    `}>
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-0 border-b transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${showDarkNavbar ? 'border-white/10 bg-gradient-to-r from-[#3A0000]/94 via-[#4A0000]/90 to-black/88 opacity-100 shadow-[0_18px_55px_rgba(30,0,0,0.18)] backdrop-blur-2xl' : 'border-transparent bg-transparent opacity-0 shadow-none backdrop-blur-0'}
        `}
      />

      <div className="user-navbar-container relative z-10 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-4 group shrink-0">
          <img
            src={logo}
            alt="Logo"
            className={`w-auto transition-[height,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${showDarkNavbar ? 'h-11 drop-shadow-sm' : 'h-12'}`}
          />
          <div className="flex flex-col">
            <span className={`text-xl font-bold tracking-tight transition-colors duration-500 ${showDarkNavbar ? 'text-white' : 'text-white'}`}>RMNHS</span>
            <span className={`text-[10px] font-medium uppercase tracking-widest leading-none transition-colors duration-500 ${showDarkNavbar ? 'text-white/50' : 'text-white/60'}`}>Quezon Province</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className={`
          hidden lg:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${showDarkNavbar ? 'bg-white/10 border-white/10 shadow-sm shadow-black/10' : 'bg-white/[0.07] border-white/[0.08] shadow-none'}
        `}>
          {navLinks.map((link) => (
            <div key={link.title} className="relative group">
              {link.dropdown ? (
                <div className="flex items-center">
                  <button
                    onClick={() => toggleDropdown(link.title)}
                    className={`
                      flex items-center gap-1 px-5 py-2 text-[13px] font-medium transition-all duration-300 rounded-full
                      ${activeDropdown === link.title 
                        ? 'bg-white text-maroon-800 shadow-sm' 
                        : (showDarkNavbar ? 'text-white/75 hover:text-white hover:bg-white/15' : 'text-white/80 hover:text-white hover:bg-white/20')
                      }
                    `}
                  >
                    {link.title}
                    <ChevronDown size={14} className={`transition-transform duration-300 group-hover:rotate-180`} />
                  </button>

                  <ul className="absolute top-full left-0 mt-4 min-w-[240px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                    {link.dropdown.map((item) => (
                      <li key={item.title} className="relative group/sub">
                        {item.submenu ? (
                          <div className="flex flex-col">
                            <button className="flex items-center justify-between w-full px-4 py-3 text-[13px] font-medium text-gray-600 hover:text-maroon-800 hover:bg-maroon-50 rounded-2xl transition-all">
                              {item.title}
                              <ChevronDown size={14} className="-rotate-90" />
                            </button>
                            <ul className="absolute top-0 left-full ml-2 min-w-[200px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 opacity-0 invisible translate-x-4 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 transition-all duration-300">
                              {item.submenu.map((sub) => (
                                <li key={sub.title}>
                                  <Link to={sub.path} className="block px-4 py-2.5 text-[12px] font-medium text-gray-500 hover:text-maroon-800 hover:bg-maroon-50 rounded-xl transition-all">
                                    {sub.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <Link to={item.path} className="block px-4 py-3 text-[13px] font-medium text-gray-600 hover:text-maroon-800 hover:bg-maroon-50 rounded-2xl transition-all">
                            {item.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  to={link.path}
                  className={`
                    px-5 py-2 text-[13px] font-medium rounded-full transition-all duration-300
                    ${location.pathname === link.path 
                      ? 'bg-white text-maroon-800 shadow-sm' 
                      : (showDarkNavbar ? 'text-white/75 hover:text-white hover:bg-white/15' : 'text-white/80 hover:text-white hover:bg-white/20')
                    }
                  `}
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <Link to="/admin/login" className={`p-3 rounded-2xl transition-all duration-500 border ${showDarkNavbar ? 'text-white/70 bg-white/10 border-white/10 hover:text-white hover:bg-white/20' : 'text-white bg-white/[0.08] border-white/[0.08] hover:bg-white/20'}`}>
            <UserRound size={20} />
          </Link>

          <button
            className={`lg:hidden p-3 rounded-2xl transition-all duration-500 ${showDarkNavbar ? 'text-white bg-white/10' : 'text-white bg-white/[0.08]'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`
        fixed inset-0 top-[88px] bg-white z-50 p-6 overflow-y-auto lg:hidden transition-all duration-500
        ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
         <div className="space-y-6">
            {navLinks.map(link => (
              <div key={link.title}>
                 {link.dropdown ? (
                    <div className="space-y-2">
                       <button onClick={() => toggleDropdown(link.title)} className="flex items-center justify-between w-full text-xl font-bold text-gray-900">
                          {link.title}
                          <ChevronDown size={20} className={activeDropdown === link.title ? 'rotate-180' : ''} />
                       </button>
                       {activeDropdown === link.title && (
                          <div className="pl-4 space-y-3 mt-2 border-l-2 border-maroon-100">
                             {link.dropdown.map(item => (
                                <Link key={item.title} to={item.path} className="block text-gray-500 font-medium py-1">{item.title}</Link>
                             ))}
                          </div>
                       )}
                    </div>
                 ) : (
                    <Link to={link.path} className="block text-xl font-bold text-gray-900">{link.title}</Link>
                 )}
              </div>
            ))}
         </div>
      </div>
    </nav>
  );
};

export default Navbar;

