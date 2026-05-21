import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Calendar, ImageIcon, ArrowUpRight, UserRound, ShieldCheck, Building2 } from 'lucide-react';
import HeroWaveBackground from '../components/HeroWaveBackground';

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
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-36 pb-20 text-white">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="user-screen-container relative z-10">
          <div>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <Building2 size={15} />
                Institutional Hierarchy
              </div>

              <h1 className="mt-8 whitespace-nowrap text-[clamp(1.5rem,7.5vw,6rem)] font-bold leading-[0.96] tracking-tight sm:text-[clamp(2.25rem,7.5vw,6rem)]">
                Organizational Structure
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                Browse the academic department charts and view the latest official structure uploaded by the school administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="user-screen-container">
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Structure Map</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                Choose a department to open its leadership map.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-500 md:text-base">
                Each tile leads to a focused view of the department's reporting flow, update date, and published chart.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                  <Building2 size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">{departments.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Departments</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <ShieldCheck size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Live</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Registry view</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f0eb] text-gray-950">
                  <ArrowUpRight size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Tap</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Open chart</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((dept) => (
            <button
              type="button"
              key={dept.id} 
              onClick={() => openModal(dept)}
              className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white text-left shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon-950/10 hover:ring-maroon-800/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#fbfbfa] p-9">
                <div className="absolute inset-x-6 bottom-0 h-px bg-gray-100"></div>
                <img 
                  src={dept.image} 
                  alt={dept.name} 
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-maroon-800">Academic Department</span>
                  <h3 className="mt-3 text-lg font-bold leading-tight tracking-tight text-gray-950">
                    {dept.name.replace(' DEPARTMENT', '')}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-gray-500">Department structure and reporting chart</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">View chart</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-white transition-colors group-hover:bg-maroon-800">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </button>
          ))}
          </div>
        </div>
      </section>

      {selectedDept && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-xl animate-in fade-in duration-300 md:p-6"
          onClick={() => setSelectedDept(null)}
        >
          <div 
            className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-6 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              aria-label="Close organizational chart"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-maroon-800 md:right-6 md:top-6"
              onClick={() => setSelectedDept(null)}
            >
              <X size={22} />
            </button>

            <div className="grid overflow-y-auto lg:grid-cols-[360px_minmax(0,1fr)]">
              <aside className="border-b border-gray-100 bg-[#fbfbfa] p-6 md:p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-maroon-800 text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-maroon-800">Verified Registry</span>
                </div>
                
                <h2 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                  {selectedDept.name.replace(' DEPARTMENT', '')}
                </h2>
                <p className="mt-4 text-base font-medium leading-7 text-gray-500">
                  Official reporting structure for the {selectedDept.name.toLowerCase()}.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                      <UserRound size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Supervisor</p>
                      <p className="text-sm font-bold text-gray-950">{selectedDept.head}</p>
                    </div>
                  </div>

                  {!loading && modalData?.updated_at && (
                    <div className="flex items-center gap-4 rounded-2xl bg-gray-950 p-4 text-white shadow-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-maroon-200">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Updated</p>
                        <p className="text-sm font-bold">
                          {new Date(modalData.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              <div className="min-h-[520px] bg-white p-5 md:p-8">
                <div className="flex h-full min-h-[480px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-gray-200 bg-[#fbfbfa]">
                  {loading ? (
                    <div className="flex flex-col items-center gap-5">
                      <div className="h-11 w-11 animate-spin rounded-full border-2 border-maroon-800 border-t-transparent"></div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">Loading chart</p>
                    </div>
                  ) : modalData?.image ? (
                    <div className="h-full w-full p-4 md:p-8">
                      <img 
                        src={modalData.image} 
                        alt={selectedDept.name} 
                        className="h-full max-h-[68vh] w-full object-contain" 
                      />
                    </div>
                  ) : (
                    <div className="max-w-md px-6 py-16 text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-gray-300 shadow-sm ring-1 ring-black/5">
                        <ImageIcon size={38} />
                      </div>
                      <h4 className="text-2xl font-bold tracking-tight text-gray-950">Chart pending upload</h4>
                      <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-6 text-gray-500">
                        This department does not have a published organizational chart yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrganizationalStructure;
