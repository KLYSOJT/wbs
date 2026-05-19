import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Book, BookCheck, BookOpen, Calculator, ChevronRight, ExternalLink, FileText, Folder, Globe, Heart, Microscope, Music, Search, Sprout } from 'lucide-react';
import HeroWaveBackground from '../../components/HeroWaveBackground';

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
  'VALUES EDUCATION': <Heart size={20} />,
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
        setActiveSubject(subjects[0] || null);
      } catch (err) {
        console.error('Error fetching learning materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [grade]);

  const subjects = Object.keys(records);
  const activeFiles = records[activeSubject] || [];

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-36 pb-20 text-white">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="user-screen-container relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <BookCheck size={15} />
                Academic Resources - {grade}
              </div>

              <h1 className="mt-8 text-5xl font-bold leading-[0.96] tracking-tight md:text-7xl lg:text-8xl">
                Curriculum Vault
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                Browse digital learning materials by subject stream and open available modules for {grade}.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
              <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-5 text-gray-950">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-800">
                  <Folder size={22} />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">{loading ? '--' : subjects.length}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject streams</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/18 px-5 py-4">
                <Search size={18} className="text-white/50" />
                <p className="text-sm font-medium text-white/68">Select a subject to view files.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="user-screen-container">
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Learning Directory</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">{grade} digital materials</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-500">
              Materials are grouped by subject and may include modules, guides, and supplementary references.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-5 rounded-[1.5rem] bg-white py-24 shadow-sm ring-1 ring-black/5">
              <div className="h-11 w-11 animate-spin rounded-full border-2 border-maroon-800 border-t-transparent"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading subject archives</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-white py-24 text-center shadow-sm ring-1 ring-black/5">
              <Folder size={40} className="mx-auto mb-5 text-gray-300" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No digital assets found in the {grade} repository.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
              <aside className="lg:sticky lg:top-28">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 text-white">
                      <BookCheck size={18} />
                    </div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Subject Streams</h2>
                  </div>

                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => setActiveSubject(subject)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-4 text-left text-sm font-bold transition-all ${
                          activeSubject === subject
                            ? 'bg-gray-950 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-[#fbfbfa] hover:text-maroon-800'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className={activeSubject === subject ? 'text-maroon-200' : 'text-maroon-800'}>
                            {SUBJECT_ICON_MAP[subject] || <Folder size={18} />}
                          </span>
                          <span className="truncate capitalize">{subject.toLowerCase()}</span>
                        </span>
                        <ChevronRight size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <section className="lg:col-span-3">
                <div className="mb-5 flex flex-col justify-between gap-3 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-maroon-800"></span>
                    Viewing {activeSubject}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{activeFiles.length} Assets Found</span>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {activeFiles.map((file) => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon-950/10"
                    >
                      <div>
                        <div className="mb-8 flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-800 transition-colors group-hover:bg-maroon-800 group-hover:text-white">
                            <FileText size={22} />
                          </div>
                          <span className="rounded-full bg-[#fbfbfa] px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-maroon-800">
                            {file.quarter || 'Standard Module'}
                          </span>
                        </div>

                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Learning Resource</p>
                        <h4 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-950 transition-colors group-hover:text-maroon-800">
                          {file.title}
                        </h4>
                      </div>

                      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Open resource</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-white transition-colors group-hover:bg-maroon-800">
                          <ExternalLink size={15} />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default LearningMaterials;
