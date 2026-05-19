import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, UserRound, ArrowRight } from 'lucide-react';
import logo from '../assets/imgs/rectologo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showDarkNavbar = scrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/' },
    {
      title: 'About',
      path: '#',
      dropdown: [
        { title: 'Org Structure', path: '/about/organizational-structure' },
        { title: 'Recognized Units', path: '/about/recognized-organizations' },
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
        { title: 'Transparency Seal', path: '/transparency/info' },
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
        { title: 'Red Cross', path: '/transparency/red-cross' },
        { title: 'MOOE', path: '/transparency/mooe' },
        { title: 'SEF Records', path: '/transparency/sef' },
        { title: 'Year End Report', path: '/transparency/year-end-report' },
      ],
    },
    { title: 'Research', path: '/research' },
  ];

  const toggleDropdown = (title) => {
    if (window.innerWidth <= 1024) {
      setActiveDropdown(activeDropdown === title ? null : title);
    }
  };

  return (
    <nav className={`
      fixed top-0 z-[100] w-full transition-all duration-500 font-outfit
      ${showDarkNavbar ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-8'}
    `}>
      <div className="max-w-[1440px] mx-auto px-10 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-4 group shrink-0">
          <div className="bg-white p-2 rounded-2xl shadow-sm group-hover:shadow-lg transition-all">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-bold tracking-tight transition-colors duration-500 ${showDarkNavbar ? 'text-gray-900' : 'text-white'}`}>RMNHS</span>
            <span className={`text-[10px] font-medium uppercase tracking-widest leading-none transition-colors duration-500 ${showDarkNavbar ? 'text-gray-400' : 'text-white/60'}`}>Quezon Province</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className={`
          hidden lg:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-sm transition-all duration-500
          ${showDarkNavbar ? 'bg-gray-50/50 border-gray-100' : 'bg-white/10 border-white/10'}
        `}>
          {navLinks.map((link) => (
            <div key={link.title} className="relative group">
              {link.dropdown ? (
                <div className="flex items-center">
                  <button
                    onClick={() => toggleDropdown(link.title)}
                    className={`
                      flex items-center gap-1 px-5 py-2 text-[13px] font-medium transition-all rounded-full
                      ${activeDropdown === link.title 
                        ? 'bg-white text-maroon-800 shadow-sm' 
                        : (showDarkNavbar ? 'text-gray-600 hover:text-gray-900 hover:bg-white/50' : 'text-white/80 hover:text-white hover:bg-white/20')
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
                    px-5 py-2 text-[13px] font-medium rounded-full transition-all
                    ${location.pathname === link.path 
                      ? 'bg-white text-maroon-800 shadow-sm' 
                      : (showDarkNavbar ? 'text-gray-600 hover:text-gray-900 hover:bg-white/50' : 'text-white/80 hover:text-white hover:bg-white/20')
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
        <div className="flex items-center gap-4">
          <button className={`hidden lg:flex items-center gap-2 premium-btn !py-2 !px-6 !text-sm ${showDarkNavbar ? 'premium-btn-primary' : 'bg-white text-maroon-800 hover:bg-maroon-50'}`}>
            Enroll Now <ArrowRight size={16} />
          </button>
          
          <Link to="/admin/login" className={`p-3 rounded-2xl transition-all border ${showDarkNavbar ? 'text-gray-400 bg-gray-50 border-gray-100 hover:text-maroon-800' : 'text-white bg-white/10 border-white/10 hover:bg-white/20'}`}>
            <UserRound size={20} />
          </Link>

          <button
            className={`lg:hidden p-3 rounded-2xl transition-colors ${showDarkNavbar ? 'text-gray-900 bg-gray-50' : 'text-white bg-white/10'}`}
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
            <button className="w-full premium-btn premium-btn-primary mt-10">Enroll Now</button>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;

