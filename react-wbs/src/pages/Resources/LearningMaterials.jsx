import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BookOpen, Folder, FileText, ExternalLink, ChevronRight, BookCheck, Microscope, Calculator, Music, Heart, Sprout, Globe, Book } from 'lucide-react';

const SUBJECT_ICON_MAP = {
  ENGLISH: <BookOpen size={20} />,
  ESP: <Heart size={20} />,
  FILIPINO: <Book size={20} />,
  MATH: <Calculator size={20} />,
  SCIENCE: <Microscope size={20} />,
  'MUSIC & ARTS': <Music size={20} />,
  'PE & HEALTH': <Heart size={20} />,
  SPJ: <FileText size={20} />,
  TLE: <Sprout size={20} />,
  SPSTEM: <Microscope size={20} />,
  SPA: <Music size={20} />,
  AP: <Globe size={20} />,
  'VALUES EDUCATION': <Heart size={20} />
};

const LearningMaterials = ({ grade }) => {
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('learning_materials')
          .select('*')
          .eq('grade', grade)
          .order('subject', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const grouped = (data || []).reduce((acc, curr) => {
          const subject = curr.subject.toUpperCase();
          if (!acc[subject]) acc[subject] = [];
          acc[subject].push(curr);
          return acc;
        }, {});

        setRecords(grouped);
        const subjects = Object.keys(grouped);
        if (subjects.length > 0) setActiveSubject(subjects[0]);
      } catch (err) {
        console.error('Error fetching learning materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [grade]);

  const activeFiles = records[activeSubject] || [];

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Cinematic Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Academic Resources • {grade}
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Curriculum
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Vault
              </span>
            </div>
          </div>
          <div className="h-1 w-24 bg-maroon-800/20 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-maroon-800 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-12 h-12 border-2 border-maroon-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse italic font-outfit">Synchronizing Subject Archives...</p>
          </div>
        ) : Object.keys(records).length === 0 ? (
          <div className="text-center py-32 bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-xl">
                <Folder size={40} />
             </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] italic">No digital assets found in the {grade} repository.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1 space-y-8 sticky top-32">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-100">
                <div className="flex items-center gap-3 mb-10">
                   <div className="w-10 h-10 bg-maroon-950 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <BookCheck size={20} />
                   </div>
                   <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                    Subject Streams
                  </h2>
                </div>
                <div className="space-y-2">
                  {Object.keys(records).map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setActiveSubject(subject)}
                      className={`
                        w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold uppercase tracking-tighter text-xs transition-all text-left group
                        ${activeSubject === subject 
                          ? 'bg-maroon-950 text-white shadow-2xl shadow-maroon-900/20 translate-x-2' 
                          : 'text-gray-400 hover:bg-gray-50 hover:text-maroon-900'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                         <span className={`transition-colors ${activeSubject === subject ? 'text-maroon-400' : 'text-gray-300 group-hover:text-maroon-800'}`}>
                          {SUBJECT_ICON_MAP[subject] || <Folder size={18} />}
                         </span>
                         <span className="truncate font-['Playfair_Display'] italic tracking-tight text-sm capitalize">{subject.toLowerCase()}</span>
                      </div>
                      <ChevronRight size={14} className={`transition-all duration-500 ${activeSubject === subject ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Files Panel */}
            <section className="lg:col-span-3">
              <div className="flex items-center justify-between px-8 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-10">
                <div className="flex items-center gap-3 italic">
                  <span className="w-1.5 h-1.5 rounded-full bg-maroon-800 animate-pulse"></span>
                  Viewing {activeSubject}
                </div>
                <span>{activeFiles.length} Assets Found</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeFiles.map((file) => (
                  <a
                    key={file.id}
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between min-h-[320px] overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity">
                       <FileText size={180} />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-maroon-950 group-hover:bg-maroon-950 group-hover:text-white transition-all duration-700 shadow-inner">
                          <FileText size={24} />
                        </div>
                        <span className="bg-maroon-50 text-maroon-800 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">
                          {file.quarter || 'Standard Module'}
                        </span>
                      </div>
                      
                      <div className="mb-8">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Resource v1.2</p>
                        <h4 className="text-3xl font-bold text-gray-900 tracking-tighter leading-tight group-hover:text-maroon-800 transition-colors font-['Playfair_Display'] italic">
                          {file.title}
                        </h4>
                      </div>
                    </div>
                    
                    <div className="relative z-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-maroon-800"></div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Vault Link</span>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-maroon-950 group-hover:bg-maroon-950 group-hover:text-white transition-all group-hover:rotate-45">
                          <ExternalLink size={14} />
                       </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningMaterials;
