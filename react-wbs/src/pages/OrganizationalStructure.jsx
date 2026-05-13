import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Calendar, ImageIcon } from 'lucide-react';

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
  { id: 'TLE', name: 'TLE DEPARTMENT', image: tle },
  { id: 'Math', name: 'MATH DEPARTMENT', image: math },
  { id: 'English', name: 'ENGLISH DEPARTMENT', image: english },
  { id: 'Science', name: 'SCIENCE DEPARTMENT', image: science },
  { id: 'Filipino', name: 'FILIPINO DEPARTMENT', image: filipino },
  { id: 'AP', name: 'AP DEPARTMENT', image: ap },
  { id: 'MAPEH', name: 'MAPEH DEPARTMENT', image: mapeh },
  { id: 'Values Education', name: 'VALUES EDUCATION DEPARTMENT', image: esp },
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
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-20 text-center">
        <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Hierarchy</span>
        <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Organizational Structure</h1>
        <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {departments.map((dept) => (
          <div 
            key={dept.id} 
            onClick={() => openModal(dept)}
            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 cursor-pointer transition-all hover:-translate-y-4 hover:shadow-maroon-900/10"
          >
            <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-10 overflow-hidden relative">
              <div className="absolute inset-0 bg-maroon-900 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <img 
                src={dept.image} 
                alt={dept.name} 
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" 
              />
            </div>
            <div className="bg-white group-hover:bg-maroon-900 py-6 px-4 text-center transition-all duration-500 border-t border-gray-50 group-hover:border-maroon-900">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors leading-tight">
                {dept.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Department Modal */}
      {selectedDept && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-maroon-950/90 backdrop-blur-xl animate-in fade-in duration-500"
          onClick={() => setSelectedDept(null)}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-8 right-8 p-3 text-gray-400 hover:text-maroon-800 hover:bg-gray-100 transition-all rounded-full z-10"
              onClick={() => setSelectedDept(null)}
            >
              <X size={32} />
            </button>

            <div className="flex flex-col lg:flex-row h-full lg:h-[700px]">
              {/* Info Side */}
              <div className="lg:w-1/3 bg-gray-50 p-12 flex flex-col justify-between border-r border-gray-100">
                <div>
                  <span className="text-maroon-800 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Departmental Chart</span>
                  <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight mb-8">
                    {selectedDept.name.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word} <br />
                      </React.Fragment>
                    ))}
                  </h2>
                  <p className="text-gray-500 font-medium leading-relaxed italic">
                    This document outlines the official hierarchy and reporting structure of the {selectedDept.name.toLowerCase()} as recognized by the school administration.
                  </p>
                </div>

                {!loading && modalData?.updated_at && (
                  <div className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-inner">
                    <div className="w-10 h-10 bg-maroon-50 rounded-xl flex items-center justify-center text-maroon-900">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Verified</p>
                      <p className="text-xs font-bold text-gray-900">
                        {new Date(modalData.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Side */}
              <div className="lg:w-2/3 p-12 bg-white flex items-center justify-center">
                <div className="w-full h-full bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                  {loading ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-16 h-16 border-4 border-maroon-800 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Accessing Records...</p>
                    </div>
                  ) : modalData?.image ? (
                    <div className="w-full h-full p-8 transition-transform duration-500 group-hover:scale-105">
                      <img 
                        src={modalData.image} 
                        alt={selectedDept.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  ) : (
                    <div className="text-center p-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <ImageIcon size={48} />
                      </div>
                      <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">No Data Available</h4>
                      <p className="text-gray-400 font-medium italic text-sm">The official chart for this department is currently undergoing administrative review.</p>
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
