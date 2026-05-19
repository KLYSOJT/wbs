import React, { useState } from 'react';
import oldrecto from '../assets/imgs/oldrecto.png';
import { Languages, Quote } from 'lucide-react';

const History = () => {
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'FIL' : 'EN'));
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Cinematic Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full bg-[radial-gradient(circle,rgba(128,0,0,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Legacy & Heritage
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Historical
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Profile
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Image Sidebar Section */}
          <div className="lg:col-span-5 space-y-12 sticky top-32">
            <div className="group relative">
              <div className="absolute inset-0 bg-maroon-900 rounded-[3rem] rotate-3 scale-105 opacity-5 group-hover:rotate-0 transition-transform duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-maroon-900/10 border-[12px] border-white ring-1 ring-gray-100 transition-transform duration-700 group-hover:-translate-y-2">
                <img 
                  src={oldrecto} 
                  alt="Old Recto Memorial National High School" 
                  className="w-full h-auto grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                   <p className="text-white text-xs font-bold uppercase tracking-widest">Circa 1941 Archive</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <button 
                onClick={toggleLanguage}
                className="group relative flex items-center gap-4 bg-gray-900 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-maroon-900 transition-all shadow-xl hover:shadow-maroon-900/20 active:scale-95"
              >
                <Languages size={18} className="group-hover:rotate-180 transition-transform duration-500 text-maroon-400" />
                {language === 'EN' ? 'Translate to Filipino' : 'Translate to English'}
              </button>
              
              <div className="flex flex-col items-center">
                <div className="flex -space-x-2 mb-4">
                   {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 shadow-sm"></div>)}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Document Version 2026.04 • Verified Repository</p>
              </div>
            </div>
          </div>

          {/* Narrative Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Quote size={200} className="text-maroon-900" />
              </div>
              
              <div className="relative z-10 prose prose-xl max-w-none text-gray-600 leading-relaxed space-y-10 font-medium font-outfit">
                {language === 'EN' ? (
                  <>
                    <p className="text-2xl text-gray-900 font-bold leading-snug font-['Playfair_Display'] italic">
                      The school was formerly the Tayabas Academy, a private school founded in 1941 when Mr. Petronio Pasumbal was the mayor of the town. It flourished for several years and became of great service to nearby towns.
                    </p>
                    <div className="space-y-8">
                      <p>In 1964 the name was changed to <span className="text-maroon-800 font-bold">Luzonian Institute</span> and while at the peak of its career and development, the management decided to expand its services due to increase in enrolment and the desire of the townspeople for more educational opportunity.</p>
                      
                      <div className="bg-maroon-50/50 rounded-[2.5rem] p-10 border-l-4 border-maroon-800 relative">
                         <p className="text-gray-700 italic leading-relaxed">
                           "In February 8, 1965, the management added tertiary level and changed Luzonian Institute to Recto Memorial College in honour of Don Claro M. Recto, who was believed to be born in Tiaong."
                         </p>
                      </div>

                      <p>In 1968, the directorship was assigned to Mrs. Soledad Ananias with a principal, Mrs. Amparo Tome. During the incumbency of Mrs. Tome, there was unrest among the faculty members. They went on strike demanding a salary increase.</p>
                      
                      <p>The management, unable to meet the demands, decided to make the school public. As a consequence, it was changed into a public school and was named <span className="text-gray-900 font-bold">Recto Memorial Provincial High School</span> in July 27, 1970.</p>
                      
                      <p className="font-bold text-gray-900">
                        Mrs. Francisca Abcede was the first principal to serve the school for almost 7 years. In April 09, 2006, the school was gutted by fire of unknown origin leaving 39 classrooms including offices in ashes. Slowly but definitely however, it rose again.
                      </p>
                      
                      <p className="text-lg">
                        Today, 19 classrooms have been built with more constructions being laid with the help of prominent figures in the private and public sectors and specifically the Department of Education, ensuring the legacy of <span className="text-maroon-800 font-bold">Claro M. Recto</span> lives on through every student.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-2xl text-gray-900 font-bold leading-snug font-['Playfair_Display'] italic">
                      Isa sa pinakamalaking pampublikong paaralan sa lalawigan ng Quezon ang Pambansang Mataas na Paaralang Pang-alaala kay Recto o mas higit na kilala bilang Recto Memorial National High School (RMNHS).
                    </p>
                    <div className="space-y-8">
                      <p>Ang RMNHS ay pinaniniwalaang itinatag noong 1941 at unang nakilala bilang <span className="text-maroon-800 font-bold">Tayabas Academy</span> na isang pribadong paaralan. Ngunit, noong Hunyo 1, 1948 ang pangalan nito ay napalitan ng Luzonian Institute.</p>
                      
                      <div className="bg-maroon-50/50 rounded-[2.5rem] p-10 border-l-4 border-maroon-800">
                         <p className="text-gray-700 italic leading-relaxed">
                           "Samantala, noong ika-8 ng Pebrero 1965, ang pangalang RMNHS ay muling napalitan. Ito ay tinawag na Recto Memorial College bilang pang-alaala kay Don Claro M. Recto."
                         </p>
                      </div>

                      <p>Sa paglipas ng panahon ay napagdesisyunan ng mga namamahala ng paaralan na ito ay gawin nang isang ganap na mataas na paaralang pampubliko at pinangalanang <span className="text-gray-900 font-bold">Recto Memorial Provincial High School (RMPHS)</span> noong Hulyo 27, 1970.</p>
                      
                      <p className="font-bold text-gray-900">
                        Nagsimulang kilalanin ang paaralan bilang Recto Memorial National High School (RMNHS) noong taong panuruan 1993-1994, at patuloy na naglilingkod sa sambayanang Pilipino hanggang sa kasalukuyan.
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-maroon-900 rounded-xl flex items-center justify-center text-white font-bold italic shadow-lg shadow-maroon-900/20">R</div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rectorian Archives</span>
                 </div>
                 <div className="h-1 w-12 bg-gray-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
