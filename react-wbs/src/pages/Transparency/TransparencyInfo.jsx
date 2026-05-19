import React from 'react';
import transparencySeal from '../../assets/imgs/transparency-seal.png';
import { ShieldCheck, FileText, Sparkles, Gavel, ScrollText, CheckCircle2 } from 'lucide-react';

const TransparencyInfo = () => {
  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Institutional Accountability
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Transparency
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Seal
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 pb-32">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-maroon-50/50 rounded-full -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110 pointer-events-none"></div>
          
          <div className="p-12 md:p-20 relative z-10">
            {/* The Seal Display */}
            <div className="flex justify-center mb-24">
              <div className="relative">
                <div className="absolute inset-0 bg-maroon-800 blur-[80px] opacity-10 rounded-full"></div>
                <img 
                  src={transparencySeal} 
                  alt="Transparency Seal" 
                  className="w-80 h-auto drop-shadow-[0_32px_64px_rgba(124,10,2,0.15)] hover:scale-105 transition-transform duration-1000 relative z-10" 
                />
              </div>
            </div>

            <div className="space-y-16">
              {/* Official Decree */}
              <div className="flex gap-10 items-start">
                 <div className="w-16 h-16 bg-maroon-50 rounded-2xl flex items-center justify-center shrink-0 text-maroon-950 shadow-inner border border-maroon-100">
                    <Gavel size={28} />
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-bold text-maroon-800 uppercase tracking-[0.4em]">National Protocol</h3>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight leading-relaxed font-['Playfair_Display'] italic">
                      "National Budget Circular 542, issued by the Department of Budget and Management on August 29, 2012, reiterates compliance with Section 93 of the General Appropriations Act of FY2012."
                    </p>
                 </div>
              </div>

              {/* The Provision Card */}
              <div className="bg-gray-950 text-white rounded-[3.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-transform duration-1000 group-hover/card:scale-110">
                   <ShieldCheck size={200} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-2 h-10 bg-maroon-600 rounded-full"></div>
                     <h3 className="text-3xl font-bold tracking-tighter text-white font-['Playfair_Display'] italic">Sec. 93. Transparency Seal</h3>
                  </div>
                  
                  <p className="text-xl italic text-white/60 font-medium mb-12 leading-relaxed max-w-3xl">
                    To enhance transparency and enforce accountability, all national government agencies shall maintain a transparency seal on their official websites.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {[
                      "Institutional Mandates & Functions",
                      "Directory of High-Level Officials",
                      "Annual Financial Reports (3 Years)",
                      "Approved Budgets & Strategic Targets",
                      "Major Programs & Infrastructure Projects",
                      "Implementation & Beneficiary Status",
                      "Procurement Plans & Awarded Contracts"
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center group/item">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[11px] font-bold text-maroon-500 group-hover/item:bg-maroon-600 group-hover/item:text-white transition-all duration-500 shrink-0 border border-white/10">
                          {idx + 1}
                        </div>
                        <span className="font-bold uppercase tracking-[0.1em] text-[10px] text-white/40 group-hover/item:text-white transition-colors duration-500">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-maroon-600" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Head of Agency Accountability Verified</span>
                   </div>
                   <div className="h-1 w-12 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Legal Context */}
              <div className="flex gap-10 items-start">
                 <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 text-gray-300 shadow-inner border border-gray-100">
                    <ScrollText size={28} />
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Administrative Framework</h3>
                    <p className="text-lg font-medium text-gray-500 leading-relaxed italic">
                      A Transparency Seal, prominently displayed on the main page of the website of a particular government agency, is a certificate that it has complied with the requirements of Section 93. This Seal links to a page which contains an index of downloadable items of each of the above-mentioned documents.
                    </p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 p-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-maroon-800">
                   <FileText size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Official Compliance Protocol v2.4 (2024 Cycle)</span>
             </div>
             <button className="flex items-center gap-3 bg-white px-8 py-4 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-maroon-950 hover:bg-maroon-950 hover:text-white hover:border-maroon-950 transition-all duration-500 shadow-sm">
                <Sparkles size={14} className="text-maroon-600" /> View Full Digital Circular
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparencyInfo;
