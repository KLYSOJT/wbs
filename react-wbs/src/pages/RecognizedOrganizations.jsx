import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Calendar, User, FileText, ExternalLink, ImageIcon, ShieldCheck, Search, UserRound } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 py-20 font-roboto">
      <header className="mb-20 text-center">
        <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Student & Faculty Groups</span>
        <h1 className="text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Recognized Organizations</h1>
        <div className="h-1.5 w-24 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-square bg-gray-50 animate-pulse rounded-[3rem]"></div>
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No institutional organizations are registered at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {records.map((record) => (
            <div 
              key={record.id} 
              onClick={() => setSelectedRecord(record)}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 cursor-pointer transition-all hover:-translate-y-4 hover:shadow-maroon-900/10"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-12 overflow-hidden relative">
                <div className="absolute inset-0 bg-maroon-900 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <img 
                  src={resolveImageUrl(record, 'logo')} 
                  alt={record.org_name} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" 
                />
              </div>
              <div className="bg-white group-hover:bg-maroon-900 py-6 px-4 text-center transition-all duration-500 border-t border-gray-50 group-hover:border-maroon-900">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors leading-tight">
                  {record.org_name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Organization Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-maroon-950/90 backdrop-blur-xl animate-in fade-in duration-500"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-white w-full max-w-6xl h-[85vh] rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-8 right-8 p-3 text-gray-400 hover:text-maroon-800 hover:bg-gray-100 transition-all rounded-full z-10"
              onClick={() => setSelectedRecord(null)}
            >
              <X size={32} />
            </button>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
              {/* Left Side: Media Viewer */}
              <div className="lg:w-3/5 bg-gray-100 flex items-center justify-center p-12 border-r border-gray-100 overflow-hidden relative group">
                <div className="w-full h-full bg-white rounded-[3rem] shadow-inner flex items-center justify-center overflow-hidden border border-gray-200">
                  <img 
                    src={resolveImageUrl(selectedRecord, 'chart')} 
                    alt={`${selectedRecord.org_name} Chart`} 
                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-maroon-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                  Organizational Chart
                </div>
              </div>

              {/* Right Side: Details & Reports */}
              <div className="lg:w-2/5 p-12 overflow-y-auto bg-white">
                <div className="mb-12">
                  <span className="text-maroon-800 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Official Profile</span>
                  <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight mb-4">
                    {selectedRecord.org_name}
                  </h2>
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Recognized Student Organization</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 transition-all hover:bg-maroon-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-maroon-900 shadow-sm mb-4">
                      <Calendar size={20} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Established</p>
                    <p className="text-sm font-black text-gray-900">
                      {selectedRecord.date_established ? new Date(selectedRecord.date_established).getFullYear() : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 transition-all hover:bg-maroon-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-maroon-900 shadow-sm mb-4">
                      <UserRound size={20} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Moderator</p>
                    <p className="text-sm font-black text-gray-900 line-clamp-1">
                      {selectedRecord.adviser_name || 'Administrative Control'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <FileText size={16} className="text-maroon-800" /> Compliance Reports
                  </h3>
                  <div className="space-y-4">
                    {getPdfEntries(selectedRecord).length > 0 ? (
                      getPdfEntries(selectedRecord).map((pdf, idx) => (
                        <a 
                          key={idx}
                          href={pdf.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 text-gray-900 hover:bg-maroon-900 hover:text-white transition-all group border border-gray-100 shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-current">
                              <ExternalLink size={14} />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">{pdf.name}</span>
                          </div>
                          <span className="text-[10px] font-black opacity-40 uppercase">PDF</span>
                        </a>
                      ))
                    ) : (
                      <div className="text-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">No archive records found.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-12 pt-12 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic text-center">
                    RMNS Student Services Division
                  </p>
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
