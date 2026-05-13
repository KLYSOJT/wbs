import React, { useState } from 'react';
import oldrecto from '../assets/imgs/oldrecto.png';
import { Languages } from 'lucide-react';

const History = () => {
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'FIL' : 'EN'));
  };

  return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-20 text-center">
          <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Legacy & Heritage</span>
          <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">History Profile</h1>
          <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Image Section */}
          <div className="space-y-10 sticky top-32">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-maroon-900/10 border-8 border-white ring-1 ring-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src={oldrecto} alt="Old Recto Memorial National High School" className="w-full h-auto" />
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={toggleLanguage}
                className="group flex items-center gap-4 bg-maroon-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-maroon-800 transition-all shadow-2xl shadow-maroon-900/20 active:scale-95"
              >
                <Languages size={20} className="group-hover:rotate-12 transition-transform" />
                {language === 'EN' ? 'Translate to Filipino' : 'Translate to English'}
              </button>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Document Version 2026.04</p>
            </div>
          </div>

          {/* Text Section */}
          <div className="bg-white rounded-[3rem] p-12 lg:p-16 shadow-2xl shadow-gray-200/50 border border-gray-50 relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-maroon-50 rounded-full flex items-center justify-center text-maroon-900 text-4xl font-black italic shadow-inner">"</div>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8 font-medium">
              {language === 'EN' ? (
                <>
                  <p className="text-xl text-gray-900 font-bold leading-snug">The school was formerly the Tayabas Academy, a private school founded in 1941 when Mr. Petronio Pasumbal was the mayor of the town. It flourished for several years and became of great service to nearby towns.</p>
                  <p>In 1964 the name was changed to Luzonian Institute and while at the peak of its career and development, the management decided to expand its services due to increase in enrolment and the desire of the townspeople for more educational opportunity. In February 8, 1965, the management added tertiary level and changed Luzonian Institute to Recto Memorial College in honour of Don Claro M. Recto, who was believed to be born in Tiaong.</p>
                  <p>In 1968, the directorship was assigned to Mrs. Soledad Ananias with a principal, Mrs. Amparo Tome. During the incumbency of Mrs. Tome, there was unrest among the faculty members. They went on strike demanding a salary increase. The management, unable to meet the demands, decided to make the school public. As a consequence, it was changed into a public school and was named Recto Memorial Provincial High School in July 27, 1970.</p>
                  <p className="border-l-4 border-maroon-800 pl-8 py-2 italic bg-maroon-50/50 rounded-r-2xl text-gray-600">Mrs. Francisca Abcede was the first principal to serve the school for almost 7 years. In April 09, 2006, the school was gutted by fire of unknown origin leaving 39 classrooms including offices in ashes. Slowly but definitely however, it rose again.</p>
                  <p>Today, 19 classrooms have been built with more constructions being laid with the help of prominent figures in the private and public sectors and specifically the Department of Education, ensuring the legacy of Claro M. Recto lives on through every student.</p>
                </>
              ) : (
                <>
                  <p className="text-xl text-gray-900 font-bold leading-snug">Isa sa pinakamalaking pampublikong paaralan sa lalawigan ng Quezon ang Pambansang Mataas na Paaralang Pang-alaala kay Recto o mas higit na kilala bilang Recto Memorial National High School (RMNHS).</p>
                  <p>Ang RMNHS ay pinaniniwalaang itinatag noong 1941 at unang nakilala bilang Tayabas Academy na isang pribadong paaralan. Ngunit, noong Hunyo 1, 1948 ang pangalan nito ay napalitan ng Luzonian Institute bilang kapatid na paaralan ng Luzonian Colleges sa Lungsod ng Lucena.</p>
                  <p>Samantala, noong ika-8 ng Pebrero 1965, ang pangalang RMNHS ay muling napalitan. Ito ay tinawag na Recto Memorial College bilang pang-alaala kay Don Claro M. Recto (Pebrero 8, 1890 - Oktubre 2, 1960) isang makabayang abogado, mambabatas, manunulat at kilalang politiko na tubong-Tiaong.</p>
                  <p className="border-l-4 border-maroon-800 pl-8 py-2 italic bg-maroon-50/50 rounded-r-2xl text-gray-600">Sa paglipas ng panahon ay napagdesisyunan ng mga namamahala ng paaralan na ito ay gawin nang isang ganap na mataas na paaralang pampubliko at pinangalanang Recto Memorial Provincial High School (RMPHS) noong Hulyo 27, 1970.</p>
                  <p>Nagsimulang kilalanin ang paaralan bilang Recto Memorial National High School (RMNHS) noong taong panuruan 1993-1994, at patuloy na naglilingkod sa sambayanang Pilipino hanggang sa kasalukuyan.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default History;
