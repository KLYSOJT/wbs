import React from 'react';
import transparencySeal from '../../assets/imgs/transparency-seal.png';
import { ShieldCheck, Info, FileText, Globe, Sparkles } from 'lucide-react';

const TransparencyInfo = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 font-roboto">
      <header className="mb-20 text-center">
        <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Institutional Accountability</span>
        <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Transparency Seal</h1>
        <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
      </header>

      <div className="bg-white rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-maroon-50 rounded-full -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110 opacity-50"></div>
        
        <div className="p-12 md:p-20 relative z-10">
          <div className="flex justify-center mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-maroon-800 blur-3xl opacity-10 rounded-full animate-pulse"></div>
              <img 
                src={transparencySeal} 
                alt="Transparency Seal" 
                className="w-80 h-auto drop-shadow-[0_20px_50px_rgba(124,10,2,0.2)] hover:scale-105 transition-transform duration-700 relative z-10" 
              />
            </div>
          </div>

          <div className="space-y-12 text-gray-600 leading-relaxed font-medium">
            <div className="flex gap-8 items-start">
               <div className="w-14 h-14 bg-maroon-50 rounded-2xl flex items-center justify-center shrink-0 text-maroon-900 shadow-inner">
                  <Info size={24} />
               </div>
               <p className="text-xl font-bold text-gray-900 italic tracking-tight leading-relaxed">
                 The National Budget Circular 542, issued by the Department of Budget and Management on August 29, 2012, reiterates compliance with Section 93 of the General Appropriations Act of FY2012. Section 93 is the Transparency Seal provision.
               </p>
            </div>

            <div className="bg-gray-900 text-white rounded-[3.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                 <ShieldCheck size={120} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                 <Sparkles className="text-maroon-500" size={24} />
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Sec. 93. Transparency Seal</h3>
              </div>
              <p className="text-lg italic text-white/70 font-medium mb-10 leading-relaxed">
                "To enhance transparency and enforce accountability, all national government agencies shall maintain a transparency seal on their official websites. The transparency seal shall contain the following information:"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  "Agency's mandates and functions",
                  "Names of officials and contact info",
                  "Annual reports for the last 3 years",
                  "Approved budgets and targets",
                  "Major programs and projects",
                  "Beneficiaries & Implementation status",
                  "Procurement plans & Awarded contracts"
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center group/item">
                    <div className="w-6 h-6 rounded-full bg-maroon-600 flex items-center justify-center text-[10px] font-black group-hover/item:scale-125 transition-transform shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-black uppercase italic tracking-widest text-[10px] text-white/60 group-hover/item:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-12 pt-8 border-t border-white/10 italic font-black uppercase tracking-widest text-[10px] text-maroon-500 text-center">
                The respective heads of the agencies shall be responsible for ensuring compliance.
              </p>
            </div>

            <div className="flex gap-8 items-start">
               <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 text-gray-400 shadow-inner">
                  <Globe size={24} />
               </div>
               <p className="text-lg font-medium text-gray-500 leading-relaxed italic">
                A Transparency Seal, prominently displayed on the main page of the website of a particular government agency, is a certificate that it has complied with the requirements of Section 93. This Seal links to a page within the agency's website which contains an index of downloadable items of each of the above-mentioned documents.
               </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-12 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <FileText className="text-maroon-800" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Compliance Protocol v2.4</span>
           </div>
           <button className="text-[10px] font-black uppercase tracking-[0.3em] text-maroon-800 hover:underline">
              Download Full Circular
           </button>
        </div>
      </div>
    </div>
  );
};

export default TransparencyInfo;
