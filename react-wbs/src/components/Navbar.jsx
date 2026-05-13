import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, UserRound, Sparkles, Command } from 'lucide-react';
import logo from '../assets/imgs/rectologo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/' },
    {
      title: 'Institutional',
      path: '#',
      dropdown: [
        { title: 'Org Structure', path: '/about/organizational-structure' },
        { title: 'Recognized Units', path: '/about/recognized-organizations' },
        { title: 'Historical Profile', path: '/about/history' },
        { title: 'Vision & Mission', path: '/about/vmc' },
      ],
    },
    {
      title: 'Archives',
      path: '#',
      dropdown: [
        { title: 'School Memos', path: '/resources/school-memorandum' },
        { title: 'Division Memos', path: '/resources/division-memorandum' },
        { title: 'DepEd Memos', path: '/resources/deped-memorandum' },
        { title: 'DepEd Orders', path: '/resources/deped-order' },
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
        { title: 'BSP / GSP', path: '/transparency/bsp' },
        { title: 'MOOE / TR', path: '/transparency/mooe' },
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
      fixed top-0 z-[100] w-full transition-all duration-500 font-roboto
      ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] py-4' : 'bg-white py-6 border-b border-gray-50'}
    `}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-4 group shrink-0">
             <div className="relative">
                <div className="absolute inset-0 bg-maroon-800 blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <img src={logo} alt="Logo" className="h-12 w-auto relative z-10 transition-transform group-hover:scale-110" />
             </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black italic text-gray-900 tracking-tighter group-hover:text-maroon-800 transition-colors">RMNS</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-0.5 italic">Digital Portal</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden xl:flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-6 py-2.5 gap-4 group focus-within:ring-4 focus-within:ring-maroon-50 focus-within:border-maroon-800 transition-all w-80">
            <Search size={16} className="text-gray-300 group-focus-within:text-maroon-800 transition-colors" />
            <input
              type="text"
              placeholder="Search archives..."
              className="outline-none text-xs w-full bg-transparent font-black uppercase tracking-widest placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-3 text-maroon-800 bg-gray-50 rounded-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <ul className={`
          fixed inset-0 top-[70px] bg-white flex-col p-10 gap-4 overflow-y-auto lg:static lg:flex lg:flex-row lg:bg-transparent lg:p-0 lg:gap-2 lg:items-center lg:overflow-visible
          ${isMenuOpen ? 'flex animate-in fade-in slide-in-from-right duration-500' : 'hidden lg:flex'}
        `}>
          {navLinks.map((link) => (
            <li key={link.title} className="relative group">
              {link.dropdown ? (
                <div className="flex flex-col lg:block">
                  <button
                    onClick={() => toggleDropdown(link.title)}
                    className={`
                      flex items-center justify-between w-full lg:w-auto px-6 py-4 lg:px-5 lg:py-2.5 text-xs font-black uppercase tracking-widest text-gray-700 rounded-xl transition-all hover:bg-maroon-900 hover:text-white
                      ${activeDropdown === link.title ? 'bg-maroon-900 text-white' : ''}
                    `}
                  >
                    {link.title}
                    <ChevronDown size={14} className={`ml-2 transition-transform lg:group-hover:rotate-180 ${activeDropdown === link.title ? 'rotate-180' : ''}`} />
                  </button>

                  <ul className={`
                    lg:absolute lg:top-full lg:left-0 lg:min-w-[280px] lg:bg-white lg:shadow-2xl lg:rounded-[2rem] lg:py-6 lg:mt-4 lg:border lg:border-gray-50 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:transition-all lg:translate-y-4 lg:group-hover:translate-y-0
                    ${activeDropdown === link.title ? 'block mt-4 space-y-2' : 'hidden lg:block'}
                  `}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-50 hidden lg:block"></div>
                    {link.dropdown.map((item) => (
                      <li key={item.title} className="relative group/sub">
                        {item.submenu ? (
                          <div className="flex flex-col lg:block px-4">
                            <button
                              onClick={() => toggleDropdown(item.title)}
                              className="flex items-center justify-between w-full px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-maroon-800 hover:bg-maroon-50 transition-all"
                            >
                              {item.title}
                              <ChevronDown size={14} className="lg:-rotate-90" />
                            </button>
                            <ul className={`
                              lg:absolute lg:top-0 lg:left-full lg:min-w-[200px] lg:bg-white lg:shadow-2xl lg:rounded-[1.5rem] lg:py-4 lg:ml-4 lg:border lg:border-gray-50 lg:opacity-0 lg:invisible lg:group-hover/sub:opacity-100 lg:group-hover/sub:visible lg:transition-all lg:translate-x-4 lg:group-hover/sub:translate-x-0
                              ${activeDropdown === item.title ? 'block mt-2 ml-4 bg-maroon-50/20 rounded-xl overflow-hidden' : 'hidden lg:block'}
                            `}>
                              {item.submenu.map((sub) => (
                                <li key={sub.title}>
                                  <Link
                                    to={sub.path}
                                    className="block px-8 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-maroon-800 hover:translate-x-2 transition-all"
                                  >
                                    {sub.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="px-4">
                             <Link
                              to={item.path}
                              className="block px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-maroon-800 hover:bg-maroon-50 transition-all"
                            >
                              {item.title}
                            </Link>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  to={link.path}
                  className={`
                    block px-6 py-4 lg:px-5 lg:py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all
                    ${location.pathname === link.path ? 'bg-maroon-900 text-white shadow-xl' : 'text-gray-700 hover:bg-maroon-900 hover:text-white'}
                  `}
                >
                  {link.title}
                </Link>
              )}
            </li>
          ))}

          {/* User Console Link */}
          <li className="lg:ml-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-3 bg-gray-900 text-white px-6 py-4 lg:py-3 lg:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-maroon-900 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
            >
              <Command size={16} />
              <span>Admin Console</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
