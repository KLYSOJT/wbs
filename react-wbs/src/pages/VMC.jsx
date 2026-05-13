import React, { useState } from 'react';
import { ChevronDown, FileText, ExternalLink, ShieldCheck, Sparkles, Target, Compass } from 'lucide-react';

// Import assets (placeholders or actual)
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
      icon: 'Spirituality',
      image: makadiyos,
      description: 'Values and promotes spirituality and faith in the Divine.',
      reports: [{ title: 'Accomplishment Report 2024', url: '#' }]
    },
    { 
      id: 'tao', 
      name: 'Maka-Tao', 
      icon: 'Humanity',
      image: makatao,
      description: 'Upholds human dignity and promotes social justice and equity.',
      reports: []
    },
    { 
      id: 'kalikasan', 
      name: 'Makakalikasan', 
      icon: 'Nature',
      image: makakalikasan,
      description: 'Promotes environmental protection and sustainable development.',
      reports: []
    },
    { 
      id: 'bansa', 
      name: 'Makabansa', 
      icon: 'Patriotism',
      image: makabansa,
      description: 'Promotes love of country and national pride.',
      reports: [{ title: 'Patriotism Project 2024', url: '#' }]
    },
  ];

  const toggleValue = (id) => {
    setActiveValue(activeValue === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-roboto">
      <header className="mb-20 text-center animate-in fade-in slide-in-from-top-10 duration-700">
        <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Foundation</span>
        <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Vision & Mission</h1>
        <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
      </header>

      <div className="space-y-32">
        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Vision Card */}
          <div className="group relative bg-maroon-900 text-white rounded-[4rem] p-16 overflow-hidden shadow-2xl shadow-maroon-900/20 animate-in fade-in slide-in-from-left duration-700">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-125"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <Sparkles size={24} />
                </div>
                <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Long-term Aspirations</span>
              </div>
              <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-10 text-white leading-none">Our Vision</h2>
              <p className="text-3xl font-bold leading-tight text-white/90 italic tracking-tight">
                "We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation."
              </p>
            </div>
            <div className="mt-16 pt-10 border-t border-white/10 opacity-60">
              <p className="text-sm font-medium italic">As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.</p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="group relative bg-white rounded-[4rem] p-16 overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right duration-700">
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-maroon-50 rounded-full -ml-40 -mb-40 transition-transform duration-1000 group-hover:scale-125"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-maroon-50 rounded-2xl flex items-center justify-center border border-maroon-100">
                  <Target size={24} className="text-maroon-800" />
                </div>
                <span className="text-maroon-800/40 font-black uppercase tracking-[0.3em] text-[10px]">Our Daily Purpose</span>
              </div>
              <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-10 text-gray-900 leading-none">Our Mission</h2>
              <p className="text-xl font-bold leading-relaxed text-gray-700 mb-10">
                To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:
              </p>
              <div className="space-y-6">
                {[
                  "Students learn in a motivating environment.",
                  "Teachers facilitate learning & nurture learners.",
                  "Staff ensure a supportive learning ecosystem.",
                  "Stakeholders share responsibility for learners."
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-maroon-50 flex items-center justify-center text-maroon-900 font-black text-xs shrink-0">0{idx + 1}</div>
                    <span className="font-bold text-gray-600 text-sm uppercase tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <div className="text-center mb-20">
            <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Foundational Pillars</span>
            <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Core Values</h2>
            <div className="h-2 w-32 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {coreValues.map((value) => (
              <div key={value.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 transition-all hover:shadow-maroon-900/5">
                <div 
                  className={`flex items-center justify-between p-8 cursor-pointer transition-all ${activeValue === value.id ? 'bg-maroon-900 text-white shadow-2xl' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleValue(value.id)}
                >
                  <div className="flex items-center gap-6">
                    <div 
                      className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl transition-all ${activeValue === value.id ? 'bg-white text-maroon-900 rotate-12' : 'bg-maroon-50 text-maroon-900'}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(value.image); }}
                    >
                      {value.name[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-2">{value.name}</h3>
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeValue === value.id ? 'text-white/40' : 'text-gray-400'}`}>{value.icon}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeValue === value.id ? 'bg-white text-maroon-900' : 'bg-gray-100 text-gray-400'}`}>
                    <ChevronDown size={20} className={`transition-transform duration-500 ${activeValue === value.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {activeValue === value.id && (
                  <div className="p-10 bg-white border-t border-gray-100 animate-in slide-in-from-top-6 duration-500">
                    <p className="text-gray-500 font-medium leading-relaxed mb-8 italic">
                      {value.description}
                    </p>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <FileText size={14} className="text-maroon-800" /> Digital Records
                      </h4>
                      {value.reports.length > 0 ? (
                        <div className="space-y-3">
                          {value.reports.map((report, idx) => (
                            <a 
                              key={idx}
                              href={report.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 text-xs font-black uppercase tracking-widest text-gray-900 hover:bg-maroon-900 hover:text-white transition-all group shadow-sm"
                            >
                              {report.title}
                              <ExternalLink size={16} className="opacity-40 group-hover:opacity-100" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No public records found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-gray-900/95 backdrop-blur-2xl animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute -top-16 right-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white"
              onClick={() => setSelectedImage(null)}
            >
              <ChevronDown size={32} className="rotate-180" />
            </button>
            <div className="bg-white p-4 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <img src={selectedImage} alt="Core Value Illustration" className="w-full h-auto rounded-[3rem]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VMC;
