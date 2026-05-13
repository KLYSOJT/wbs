import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BookOpen, Folder, FileText, ExternalLink, Search, Loader2, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';

const SUBJECT_ICON_MAP = {
  ENGLISH: <BookOpen size={20} />,
  ESP: <FileText size={20} />,
  FILIPINO: <Folder size={20} />,
  MATH: <Folder size={20} />,
  SCIENCE: <Folder size={20} />,
  'MUSIC & ARTS': <Folder size={20} />,
  'PE & HEALTH': <Folder size={20} />,
  SPJ: <Folder size={20} />,
  TLE: <Folder size={20} />,
  SPSTEM: <Folder size={20} />,
  SPA: <Folder size={20} />,
  AP: <Folder size={20} />,
  'VALUES EDUCATION': <Folder size={20} />
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
    <div className="max-w-7xl mx-auto px-6 py-20 font-roboto">
      {/* Hero Section */}
      <section className="bg-gray-900 rounded-[4rem] p-16 lg:p-20 text-white mb-24 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-maroon-900/20 rounded-full -mr-72 -mt-72 blur-3xl"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-3 bg-maroon-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl">
            <GraduationCap size={16} /> Academic Resources • {grade}
          </span>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-8 leading-none">Curriculum Vault</h1>
          <p className="text-white/60 text-xl font-medium leading-relaxed italic max-w-2xl">
            Access and download essential self-learning modules, digital textbooks, and activity sheets curated for the {grade} academic level.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 border-4 border-maroon-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Synchronizing Global Archives...</p>
        </div>
      ) : Object.keys(records).length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
           <Folder size={48} className="text-gray-200 mx-auto mb-6" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No digital assets found in the {grade} repository.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 sticky top-32">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                <Sparkles size={16} className="text-maroon-800" /> Subject Stream
              </h2>
              <div className="space-y-3">
                {Object.keys(records).map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setActiveSubject(subject)}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl font-black uppercase italic tracking-tighter text-sm transition-all text-left ${
                      activeSubject === subject 
                        ? 'bg-maroon-900 text-white shadow-2xl shadow-maroon-900/20 translate-x-2' 
                        : 'bg-white text-gray-400 hover:bg-maroon-50 hover:text-maroon-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <span className={activeSubject === subject ? 'text-white' : 'text-maroon-800/40'}>
                        {SUBJECT_ICON_MAP[subject] || <Folder size={20} />}
                       </span>
                       <span className="truncate">{subject}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-all ${activeSubject === subject ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Files Panel */}
          <section className="lg:col-span-3 space-y-12">
            <div className="flex items-center justify-between px-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-8">
              <span className="flex items-center gap-3 italic">
                <Folder size={14} className="text-maroon-800" /> Currently Viewing {activeSubject} Documents
              </span>
              <span>{activeFiles.length} Digital Assets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {activeFiles.map((file) => (
                <a
                  key={file.id}
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white p-8 rounded-[3rem] border border-gray-50 shadow-2xl shadow-gray-200/50 hover:shadow-maroon-900/5 hover:-translate-y-2 transition-all flex flex-col justify-between h-72"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-maroon-900 group-hover:bg-maroon-900 group-hover:text-white transition-all duration-500 shadow-inner">
                      <FileText size={32} />
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="bg-maroon-50 text-maroon-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 shadow-sm">
                         {file.quarter || 'Module'}
                       </span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Subject Record v1.2</p>
                    <h4 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight group-hover:text-maroon-800 transition-colors line-clamp-2">
                      {file.title}
                    </h4>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                     <span>Secure Archive Link</span>
                     <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:text-maroon-800" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default LearningMaterials;
