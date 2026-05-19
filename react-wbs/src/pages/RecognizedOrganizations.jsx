import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Calendar, FileText, ShieldCheck, UserRound, ArrowUpRight } from 'lucide-react';

const RecognizedOrganizations = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('recognized-structure')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error('Error fetching organizations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  const getPdfEntries = (record) => {
    if (!record) return [];
    const entries = [];
    const urls = record.pdf_urls || [];
    const names = record.pdf_names || [];

    if (urls.length > 0) {
      urls.forEach((url, i) => {
        entries.push({ url, name: names[i] || `Accomplishment Report ${i + 1}` });
      });
    } else if (record.pdf_url) {
      entries.push({ url: record.pdf_url, name: 'Accomplishment Report' });
    }
    return entries;
  };

  const resolveImageUrl = (record, type = 'logo') => {
    if (!record) return '';
    const placeholder = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 220%22%3E%3Crect width=%22300%22 height=%22220%22 rx=%2224%22 fill=%22%23f8fafc%22/%3E%3Cpath d=%22M95 150l32-39 25 31 37-48 51 56H60l35-44z%22 fill=%22%23cbd5e1%22/%3E%3Ccircle cx=%22110%22 cy=%2276%22 r=%2218%22 fill=%22%23cbd5e1%22/%3E%3C/svg%3E';
    
    if (type === 'logo') return record.logo_url || record.chart_url || record.image_url || placeholder;
    return record.chart_url || record.image_url || record.logo_url || placeholder;
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      {/* Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(128,0,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-10 text-center relative z-10">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-maroon-800 font-bold uppercase tracking-[0.4em] text-[10px] bg-maroon-50 px-6 py-2 rounded-full">
              Student & Faculty Groups
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] leading-none">
                Recognized
              </h1>
              <span className="text-4xl md:text-6xl font-['Dancing_Script'] text-maroon-800 -ml-2 drop-shadow-sm">
                Organizations
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-gray-50/50 animate-pulse rounded-[3rem] border border-gray-100"></div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-32 bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No registered organizations found in the current cycle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {records.map((record) => (
              <div 
                key={record.id} 
                onClick={() => setSelectedRecord(record)}
                className="group relative bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="aspect-square bg-gray-50/30 flex items-center justify-center p-12 overflow-hidden relative border-b border-gray-50">
                  <div className="absolute inset-0 bg-maroon-950 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <img 
                    src={resolveImageUrl(record, 'logo')} 
                    alt={record.org_name} 
                    className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110" 
                  />
                </div>
                <div className="p-8 text-center transition-all duration-500 bg-white group-hover:bg-maroon-950">
                   <span className="text-[10px] font-bold text-maroon-800 group-hover:text-maroon-400 uppercase tracking-widest mb-2 block">Student Division</span>
                   <h3 className="font-bold text-sm text-gray-900 group-hover:text-white transition-colors leading-tight font-['Playfair_Display'] italic line-clamp-1">
                    {record.org_name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Organization Profile Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-950/90 backdrop-blur-2xl animate-in fade-in duration-500"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-white w-full max-w-6xl h-[85vh] rounded-[4rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-10 right-10 w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-maroon-800 hover:bg-gray-50 transition-all z-20 group"
              onClick={() => setSelectedRecord(null)}
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
              {/* Left Side: Media Viewer */}
              <div className="lg:w-3/5 bg-gray-50/50 flex items-center justify-center p-16 border-r border-gray-100 overflow-hidden relative group">
                <div className="w-full h-full bg-white rounded-[3rem] shadow-inner flex items-center justify-center overflow-hidden border border-gray-100 group-hover:shadow-2xl transition-shadow duration-700">
                  <img 
                    src={resolveImageUrl(selectedRecord, 'chart')} 
                    alt={`${selectedRecord.org_name} Chart`} 
                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" 
                  />
                </div>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-maroon-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                  Archival Structure Chart
                </div>
              </div>

              {/* Right Side: Details & Reports */}
              <div className="lg:w-2/5 p-16 overflow-y-auto bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-maroon-950 rounded-xl flex items-center justify-center text-white shadow-xl">
                        <ShieldCheck size={20} />
                     </div>
                     <span className="text-maroon-800 font-bold uppercase tracking-[0.3em] text-[10px]">Recognized Profile</span>
                  </div>
                  
                  <h2 className="text-5xl font-bold text-gray-900 tracking-tighter leading-tight mb-4 font-['Playfair_Display'] italic">
                    {selectedRecord.org_name}
                  </h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">RMNHS Student Services Directorate</p>
                
                  <div className="grid grid-cols-2 gap-4 mb-16">
                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                      <Calendar size={18} className="text-maroon-800 mb-4" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Established</p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedRecord.date_established ? new Date(selectedRecord.date_established).getFullYear() : 'Classic Era'}
                      </p>
                    </div>

                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                      <UserRound size={18} className="text-maroon-800 mb-4" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Moderator</p>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                        {selectedRecord.adviser_name || 'Assigned'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                      <FileText size={16} className="text-maroon-800" /> Compliance Archive
                    </h3>
                    <div className="space-y-3">
                      {getPdfEntries(selectedRecord).length > 0 ? (
                        getPdfEntries(selectedRecord).map((pdf, idx) => (
                          <a 
                            key={idx}
                            href={pdf.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/80 text-gray-900 hover:bg-maroon-950 hover:text-white transition-all group border border-gray-100 shadow-sm"
                          >
                            <span className="font-bold text-[11px] uppercase tracking-widest">{pdf.name}</span>
                            <ArrowUpRight size={16} className="text-maroon-800 group-hover:text-white transition-colors" />
                          </a>
                        ))
                      ) : (
                        <div className="text-center p-10 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-200">
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">No reports available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between opacity-40">
                  <span className="text-[10px] font-bold uppercase tracking-widest">System Record ID: {selectedRecord.id.slice(0,8)}</span>
                  <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecognizedOrganizations;
