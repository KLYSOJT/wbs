import React, { useState } from 'react';
import { ChevronDown, FileText, ExternalLink, Sparkles, Target, Heart, Leaf, Globe } from 'lucide-react';

// Import assets
import makadiyos from '../assets/imgs/makadiyos.png';
import makatao from '../assets/imgs/makatao.png';
import makakalikasan from '../assets/imgs/makakalikasan.png';
import makabansa from '../assets/imgs/makabansa.png';

const VMC = () => {
  const [activeValue, setActiveValue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const coreValues = [
    { 
      id: 'diyos', 
      name: 'Maka-Diyos', 
      icon: <Sparkles size={24} />,
      image: makadiyos,
      theme: 'maroon',
      description: 'Values and promotes spirituality and faith in the Divine through academic excellence and moral integrity.',
      reports: [{ title: 'Accomplishment Report 2024', url: '#' }]
    },
    { 
      id: 'tao', 
      name: 'Maka-Tao', 
      icon: <Heart size={24} />,
      image: makatao,
      theme: 'slate',
      description: 'Upholds human dignity and promotes social justice and equity within the Rectorian community.',
      reports: []
    },
    { 
      id: 'kalikasan', 
      name: 'Makakalikasan', 
      icon: <Leaf size={24} />,
      image: makakalikasan,
      theme: 'emerald',
      description: 'Promotes environmental protection and sustainable development as stewards of the campus.',
      reports: []
    },
    { 
      id: 'bansa', 
      name: 'Makabansa', 
      icon: <Globe size={24} />,
      image: makabansa,
      theme: 'gold',
      description: 'Promotes love of country and national pride through civic participation and cultural heritage.',
      reports: [{ title: 'Patriotism Project 2024', url: '#' }]
    },
  ];

  const toggleValue = (id) => {
    setActiveValue(activeValue === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Institutional Foundation
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Vision &
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Mission
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-32 space-y-32">
        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision Card */}
          <div className="group relative bg-maroon-950 text-white rounded-[4rem] p-16 overflow-hidden shadow-2xl transition-transform duration-700 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                  <Sparkles size={28} className="text-maroon-400" />
                </div>
                <span className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Aspirations</span>
              </div>
              <h2 className="text-5xl font-bold uppercase tracking-tighter mb-8 font-['Playfair_Display'] italic">Our Vision</h2>
              <p className="text-3xl font-medium leading-tight text-white/90 tracking-tight mb-12">
                "We dream of Filipinos who <span className="text-maroon-400">passionately love their country</span> and whose values and competencies enable them to realize their full potential."
              </p>
              <div className="pt-10 border-t border-white/10">
                <p className="text-sm font-medium text-white/60 italic leading-relaxed">
                  As a learner-centered public institution, we continuously improve to better serve our stakeholders and the nation.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="group relative bg-white rounded-[4rem] p-16 overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 transition-transform duration-700 hover:-translate-y-2">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon-50 rounded-full -ml-48 -mb-48 transition-transform duration-1000 group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-maroon-50 rounded-2xl flex items-center justify-center border border-maroon-100 shadow-sm">
                  <Target size={28} className="text-maroon-800" />
                </div>
                <span className="text-maroon-800/40 font-bold uppercase tracking-[0.3em] text-[10px]">Purpose</span>
              </div>
              <h2 className="text-5xl font-bold uppercase tracking-tighter mb-8 font-['Playfair_Display'] italic text-gray-900">Our Mission</h2>
              <p className="text-lg font-medium leading-relaxed text-gray-600 mb-10">
                To protect and promote the right of every Filipino to <span className="text-maroon-800 font-bold">quality, equitable, and culture-based</span> basic education where:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Motivating environment.",
                  "Nurtured learners.",
                  "Supportive ecosystem.",
                  "Shared responsibility."
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-maroon-800 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-bold text-gray-700 text-[11px] uppercase tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <section className="relative">
          <div className="text-center mb-20 relative z-10">
            <div className="flex flex-col items-center gap-4">
              <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
                Foundational Pillars
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <h2 className="text-5xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                  Core
                </h2>
                <span className="text-3xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                  Values
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto relative z-10">
            {coreValues.map((value) => (
              <div 
                key={value.id} 
                className={`
                  group bg-white rounded-[3rem] overflow-hidden transition-all duration-500 border border-gray-100
                  ${activeValue === value.id ? 'shadow-2xl ring-2 ring-maroon-800/5 -translate-y-2' : 'shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:-translate-y-1'}
                `}
              >
                <div 
                  className={`flex items-center justify-between p-10 cursor-pointer transition-all ${activeValue === value.id ? 'bg-maroon-950 text-white' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleValue(value.id)}
                >
                  <div className="flex items-center gap-8">
                    <div 
                      className={`
                        w-20 h-20 rounded-[1.75rem] flex items-center justify-center shadow-2xl transition-all duration-700
                        ${activeValue === value.id ? 'bg-white text-maroon-950 rotate-[10deg] scale-110' : 'bg-maroon-50 text-maroon-800'}
                      `}
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(value.image); }}
                    >
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold tracking-tighter leading-none mb-2 font-['Playfair_Display'] italic">{value.name}</h3>
                      <p className={`text-[11px] font-bold uppercase tracking-[0.25em] ${activeValue === value.id ? 'text-maroon-400' : 'text-gray-400'}`}>
                         Rectorian Integrity
                      </p>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${activeValue === value.id ? 'bg-white border-white text-maroon-950 rotate-180' : 'bg-transparent border-gray-200 text-gray-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
                
                {activeValue === value.id && (
                  <div className="p-12 bg-white border-t border-gray-100 animate-in slide-in-from-top-10 duration-500">
                    <div className="flex flex-col md:flex-row gap-10">
                       <div className="md:w-2/3">
                          <p className="text-gray-500 font-medium leading-relaxed mb-10 text-lg italic font-outfit">
                            {value.description}
                          </p>
                          <div className="space-y-6">
                            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                              <FileText size={16} className="text-maroon-800" /> Digital Records & Reports
                            </h4>
                            {value.reports.length > 0 ? (
                              <div className="grid grid-cols-1 gap-4">
                                {value.reports.map((report, idx) => (
                                  <a 
                                    key={idx}
                                    href={report.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-900 hover:bg-maroon-950 hover:text-white transition-all group shadow-sm border border-gray-100"
                                  >
                                    {report.title}
                                    <ExternalLink size={18} className="text-maroon-800 group-hover:text-white transition-colors" />
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">No public records available for this cycle.</p>
                              </div>
                            )}
                          </div>
                       </div>
                       <div className="md:w-1/3">
                          <div 
                            onClick={() => setSelectedImage(value.image)}
                            className="relative aspect-square rounded-[2rem] overflow-hidden cursor-zoom-in group/img"
                          >
                             <img src={value.image} alt={value.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110" />
                             <div className="absolute inset-0 bg-maroon-900/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-maroon-900 shadow-xl">Enlarge</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modern Gallery Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-gray-950/90 backdrop-blur-2xl animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute -top-16 right-0 text-white/60 hover:text-white transition-all flex flex-col items-center gap-2 group"
              onClick={() => setSelectedImage(null)}
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10">
                <ChevronDown size={32} className="rotate-180" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Close</span>
            </button>
            <div className="bg-white p-4 rounded-[4rem] shadow-2xl overflow-hidden ring-1 ring-white/10">
              <img src={selectedImage} alt="Core Value Illustration" className="w-full h-auto rounded-[3rem]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VMC;
