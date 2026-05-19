import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Calendar, ImageIcon, ChevronRight, UserRound, ShieldCheck } from 'lucide-react';

// Import local images
import tle from '../assets/imgs/tle.png';
import math from '../assets/imgs/math.png';
import english from '../assets/imgs/englishlogo.png';
import science from '../assets/imgs/science.png';
import filipino from '../assets/imgs/filipino.jpg';
import ap from '../assets/imgs/ap.jpg';
import mapeh from '../assets/imgs/mapeh.png';
import esp from '../assets/imgs/esp.png';

const departments = [
  { id: 'TLE', name: 'TLE DEPARTMENT', image: tle, head: 'Department Head' },
  { id: 'Math', name: 'MATH DEPARTMENT', image: math, head: 'Department Head' },
  { id: 'English', name: 'ENGLISH DEPARTMENT', image: english, head: 'Department Head' },
  { id: 'Science', name: 'SCIENCE DEPARTMENT', image: science, head: 'Department Head' },
  { id: 'Filipino', name: 'FILIPINO DEPARTMENT', image: filipino, head: 'Department Head' },
  { id: 'AP', name: 'AP DEPARTMENT', image: ap, head: 'Department Head' },
  { id: 'MAPEH', name: 'MAPEH DEPARTMENT', image: mapeh, head: 'Department Head' },
  { id: 'Values Education', name: 'VALUES EDUCATION DEPARTMENT', image: esp, head: 'Department Head' },
];

const OrganizationalStructure = () => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const openModal = async (dept) => {
    setSelectedDept(dept);
    setLoading(true);
    setModalData(null);
    
    try {
      const { data, error } = await supabase
        .from('organizational_structure')
        .select('image, updated_at')
        .eq('department', dept.id)
        .single();
        
      if (!error && data) {
        setModalData(data);
      }
    } catch (err) {
      console.error('Error fetching department data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Institutional Hierarchy
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Organizational
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Structure
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept) => (
            <div 
              key={dept.id} 
              onClick={() => openModal(dept)}
              className="group relative bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="aspect-[4/3] bg-gray-50/50 flex items-center justify-center p-12 overflow-hidden relative border-b border-gray-50">
                <div className="absolute inset-0 bg-maroon-950 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <img 
                  src={dept.image} 
                  alt={dept.name} 
                  className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-3" 
                />
              </div>
              <div className="p-8 text-center transition-all duration-500 bg-white group-hover:bg-maroon-950">
                <div className="flex flex-col items-center gap-1">
                   <span className="text-[10px] font-bold text-maroon-800 group-hover:text-maroon-400 uppercase tracking-widest mb-1">Academy Division</span>
                   <h3 className="font-bold text-sm text-gray-900 group-hover:text-white transition-colors leading-tight font-['Playfair_Display'] italic">
                    {dept.name}
                  </h3>
                </div>
                <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                      <ChevronRight size={20} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Department Modal */}
      {selectedDept && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-950/90 backdrop-blur-2xl animate-in fade-in duration-500"
          onClick={() => setSelectedDept(null)}
        >
          <div 
            className="bg-white w-full max-w-6xl h-[85vh] rounded-[4rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-10 right-10 w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-maroon-800 hover:bg-gray-50 transition-all z-20 group"
              onClick={() => setSelectedDept(null)}
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
              {/* Info Side */}
              <div className="lg:w-1/3 bg-gray-50/50 p-16 flex flex-col justify-between border-r border-gray-100 overflow-y-auto">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-maroon-950 rounded-xl flex items-center justify-center text-white shadow-xl">
                        <ShieldCheck size={20} />
                     </div>
                     <span className="text-maroon-800 font-bold uppercase tracking-[0.3em] text-[10px]">Verified Registry</span>
                  </div>
                  
                  <h2 className="text-5xl font-bold text-gray-900 tracking-tighter leading-tight mb-8 font-['Playfair_Display'] italic">
                    {selectedDept.name.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word} <br />
                      </React.Fragment>
                    ))}
                  </h2>
                  <p className="text-gray-500 font-medium leading-relaxed italic text-lg mb-10">
                    The official reporting structure for the {selectedDept.name.toLowerCase()}, established by the RMNHS Board of Governors.
                  </p>

                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                           <UserRound size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Supervisor</p>
                           <p className="text-sm font-bold text-gray-900">Department Head</p>
                        </div>
                     </div>
                  </div>
                </div>

                {!loading && modalData?.updated_at && (
                  <div className="flex items-center gap-4 p-6 bg-maroon-950 rounded-[2rem] shadow-2xl mt-12">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-maroon-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Effective As Of</p>
                      <p className="text-xs font-bold text-white">
                        {new Date(modalData.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Side */}
              <div className="lg:w-2/3 p-12 bg-white flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group/chart">
                  {loading ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-12 h-12 border-2 border-maroon-800 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Accessing Archival Records...</p>
                    </div>
                  ) : modalData?.image ? (
                    <div className="w-full h-full p-12 transition-transform duration-1000 group-hover/chart:scale-105">
                      <img 
                        src={modalData.image} 
                        alt={selectedDept.name} 
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
                    </div>
                  ) : (
                    <div className="text-center p-16">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-xl border border-gray-50">
                        <ImageIcon size={48} />
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 uppercase tracking-tighter mb-4 font-['Playfair_Display'] italic">Chart Pending Review</h4>
                      <p className="text-gray-400 font-medium italic text-sm max-w-sm mx-auto">
                        The current departmental layout is undergoing administrative updates. Please contact the Records Office for more information.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationalStructure;
