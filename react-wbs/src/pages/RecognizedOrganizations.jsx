import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Calendar, FileText, ShieldCheck, UserRound, ArrowUpRight, Building2 } from 'lucide-react';
import HeroWaveBackground from '../components/HeroWaveBackground';

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
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-36 pb-20 text-white">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="user-screen-container relative z-10">
          <div>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <Building2 size={15} />
                Student & Faculty Groups
              </div>

              <h1 className="mt-8 whitespace-nowrap text-[clamp(1.5rem,7.5vw,6rem)] font-bold leading-[0.96] tracking-tight sm:text-[clamp(2.25rem,7.5vw,6rem)]">
                Recognized Organizations
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                Browse official school organizations, view their structure charts, and open available accomplishment reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="user-screen-container">
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Campus Roster</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                Open each group profile from the recognition board.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-500 md:text-base">
                Profiles collect advisers, official logos, structure charts, and accomplishment files in one public view.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                  <Building2 size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">{loading ? '--' : records.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Groups listed</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <ShieldCheck size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Verified</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Recognition status</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f0eb] text-gray-950">
                  <FileText size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Reports</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Linked files</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-[340px] animate-pulse rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5">
                  <div className="m-6 h-48 rounded-2xl bg-gray-100"></div>
                  <div className="mx-6 mt-8 h-4 w-28 rounded bg-gray-100"></div>
                  <div className="mx-6 mt-4 h-6 w-40 rounded bg-gray-100"></div>
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-white py-24 text-center shadow-sm ring-1 ring-black/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No registered organizations found in the current cycle.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {records.map((record) => (
                <button
                  type="button"
                  key={record.id} 
                  onClick={() => setSelectedRecord(record)}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white text-left shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon-950/10 hover:ring-maroon-800/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#fbfbfa] p-9">
                    <div className="absolute inset-x-6 bottom-0 h-px bg-gray-100"></div>
                    <img 
                      src={resolveImageUrl(record, 'logo')} 
                      alt={record.org_name} 
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-maroon-800">Recognized Group</span>
                      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-tight tracking-tight text-gray-950">
                        {record.org_name}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-gray-500">Profile, structure chart, and reports</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">View profile</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-white transition-colors group-hover:bg-maroon-800">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedRecord && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-xl animate-in fade-in duration-300 md:p-6"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-6 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              aria-label="Close organization profile"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-maroon-800 md:right-6 md:top-6"
              onClick={() => setSelectedRecord(null)}
            >
              <X size={22} />
            </button>

            <div className="grid overflow-y-auto lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="min-h-[520px] bg-white p-5 md:p-8">
                <div className="flex h-full min-h-[480px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-gray-200 bg-[#fbfbfa]">
                  <img 
                    src={resolveImageUrl(selectedRecord, 'chart')} 
                    alt={`${selectedRecord.org_name} Chart`} 
                    className="h-full max-h-[68vh] w-full object-contain p-4 md:p-8" 
                  />
                </div>
              </div>

              <aside className="border-t border-gray-100 bg-[#fbfbfa] p-6 md:p-8 lg:border-l lg:border-t-0">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-maroon-800 text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-maroon-800">Recognized Profile</span>
                  </div>
                  
                  <h2 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                    {selectedRecord.org_name}
                  </h2>
                  <p className="mt-4 text-base font-medium leading-7 text-gray-500">
                    RMNHS Student Services Directorate
                  </p>
                
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Established</p>
                        <p className="text-sm font-bold text-gray-950">
                          {selectedRecord.date_established ? new Date(selectedRecord.date_established).getFullYear() : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                        <UserRound size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Moderator</p>
                        <p className="truncate text-sm font-bold text-gray-950">
                          {selectedRecord.adviser_name || 'Assigned'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                      <FileText size={16} className="text-maroon-800" />
                      Compliance Archive
                    </h3>
                    <div className="space-y-3">
                      {getPdfEntries(selectedRecord).length > 0 ? (
                        getPdfEntries(selectedRecord).map((pdf, idx) => (
                          <a 
                            key={idx}
                            href={pdf.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-gray-950 shadow-sm transition-all hover:bg-maroon-950 hover:text-white"
                          >
                            <span className="text-left text-[11px] font-bold uppercase tracking-widest">{pdf.name}</span>
                            <ArrowUpRight size={16} className="text-maroon-800 group-hover:text-white transition-colors" />
                          </a>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No reports available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 text-gray-400">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Record ID: {selectedRecord.id.slice(0,8)}</span>
                  <div className="h-1 w-8 rounded-full bg-gray-200"></div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RecognizedOrganizations;
