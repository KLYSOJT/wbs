import { useState } from 'react';
import { ChevronDown, FileText, ExternalLink, Sparkles, Target, Heart, Leaf, Globe, Building2, X } from 'lucide-react';
import HeroWaveBackground from '../components/HeroWaveBackground';

import makadiyos from '../assets/imgs/makadiyos.png';
import makatao from '../assets/imgs/makatao.png';
import makakalikasan from '../assets/imgs/makakalikasan.png';
import makabansa from '../assets/imgs/makabansa.png';

const VMC = () => {
  const [activeValue, setActiveValue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const coreValues = [
    {
      id: 'diyos',
      name: 'Maka-Diyos',
      icon: <Sparkles size={22} />,
      image: makadiyos,
      description: 'Values and promotes spirituality and faith in the Divine through academic excellence and moral integrity.',
      reports: [{ title: 'Accomplishment Report 2024', url: '#' }],
    },
    {
      id: 'tao',
      name: 'Maka-Tao',
      icon: <Heart size={22} />,
      image: makatao,
      description: 'Upholds human dignity and promotes social justice and equity within the Rectorian community.',
      reports: [],
    },
    {
      id: 'kalikasan',
      name: 'Makakalikasan',
      icon: <Leaf size={22} />,
      image: makakalikasan,
      description: 'Promotes environmental protection and sustainable development as stewards of the campus.',
      reports: [],
    },
    {
      id: 'bansa',
      name: 'Makabansa',
      icon: <Globe size={22} />,
      image: makabansa,
      description: 'Promotes love of country and national pride through civic participation and cultural heritage.',
      reports: [{ title: 'Patriotism Project 2024', url: '#' }],
    },
  ];

  const missionItems = [
    'Students learn in a child-friendly, gender-sensitive, safe, and motivating environment.',
    'Teachers facilitate learning and constantly nurture every learner.',
    'Administrators and staff ensure an enabling and supportive environment.',
    'Family, community, and other stakeholders are actively engaged.',
  ];

  const toggleValue = (id) => {
    setActiveValue(activeValue === id ? null : id);
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
                Institutional Foundation
              </div>

              <h1 className="mt-8 whitespace-nowrap text-[clamp(1.5rem,7.5vw,6rem)] font-bold leading-[0.96] tracking-tight sm:text-[clamp(2.25rem,7.5vw,6rem)]">
                Vision & Mission
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                A clear statement of the school's aspirations, public service mandate, and core values that guide every learner.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="user-screen-container">
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Values Compass</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                The commitments that shape every learner experience.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-500 md:text-base">
                Read the school direction as one connected guide: aspiration, daily service, and the values practiced in campus life.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                  <Sparkles size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Vision</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Future focus</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <Target size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Mission</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Daily work</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f0eb] text-gray-950">
                  <Heart size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">{coreValues.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Core values</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <article className="rounded-[1.5rem] bg-gray-950 p-6 text-white shadow-sm ring-1 ring-black/5 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-maroon-200">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/45">Aspirations</span>
              </div>
              <h3 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">Our Vision</h3>
              <p className="mt-6 text-2xl font-semibold leading-snug tracking-tight text-white/90">
                We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential.
              </p>
              <p className="mt-8 border-t border-white/10 pt-6 text-sm font-medium leading-7 text-white/55">
                As a learner-centered public institution, RMNHS continuously improves to better serve stakeholders and the nation.
              </p>
            </article>

            <article className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-800">
                  <Target size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-maroon-800">Purpose</span>
              </div>
              <h3 className="mt-8 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">Our Mission</h3>
              <p className="mt-6 text-base font-medium leading-7 text-gray-600">
                To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {missionItems.map((item, idx) => (
                  <div key={item} className="rounded-2xl border border-gray-100 bg-[#fbfbfa] p-4">
                    <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-maroon-800 text-xs font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-medium leading-6 text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <section className="mt-10">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Foundational Pillars</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">Core values</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-gray-500">
                Select a value to see its description, illustration, and available records.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {coreValues.map((value) => (
                <article
                  key={value.id}
                  className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-maroon-950/10"
                >
                  <button
                    type="button"
                    onClick={() => toggleValue(value.id)}
                    className={`flex w-full items-center justify-between gap-5 p-6 text-left transition-colors ${activeValue === value.id ? 'bg-gray-950 text-white' : 'hover:bg-[#fbfbfa]'}`}
                  >
                    <span className="flex items-center gap-4">
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${activeValue === value.id ? 'bg-white text-maroon-800' : 'bg-maroon-50 text-maroon-800'}`}>
                        {value.icon}
                      </span>
                      <span>
                        <span className="block text-xl font-bold tracking-tight">{value.name}</span>
                        <span className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] ${activeValue === value.id ? 'text-white/40' : 'text-gray-400'}`}>
                          Rectorian Integrity
                        </span>
                      </span>
                    </span>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform ${activeValue === value.id ? 'rotate-180 border-white/10 bg-white/10 text-white' : 'border-gray-200 text-gray-400'}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {activeValue === value.id && (
                    <div className="grid gap-6 border-t border-gray-100 p-6 md:grid-cols-[minmax(0,1fr)_180px]">
                      <div>
                        <p className="text-base font-medium leading-7 text-gray-600">{value.description}</p>
                        <div className="mt-6">
                          <h4 className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                            <FileText size={16} className="text-maroon-800" />
                            Records
                          </h4>
                          {value.reports.length > 0 ? (
                            <div className="space-y-3">
                              {value.reports.map((report) => (
                                <a
                                  key={report.title}
                                  href={report.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-[#fbfbfa] p-4 text-gray-950 transition-all hover:bg-maroon-950 hover:text-white"
                                >
                                  <span className="text-left text-[11px] font-bold uppercase tracking-widest">{report.title}</span>
                                  <ExternalLink size={16} className="text-maroon-800 group-hover:text-white" />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fbfbfa] p-6 text-center">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No public records available.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedImage(value.image)}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-[#fbfbfa] focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800"
                      >
                        <img src={value.image} alt={value.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute inset-x-4 bottom-4 rounded-full bg-white px-4 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-maroon-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          Enlarge
                        </span>
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-xl animate-in fade-in duration-300 md:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl rounded-[1.75rem] bg-white p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Close image preview"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-maroon-800"
              onClick={() => setSelectedImage(null)}
            >
              <X size={22} />
            </button>
            <img src={selectedImage} alt="Core Value Illustration" className="max-h-[82vh] w-full rounded-[1.25rem] object-contain" />
          </div>
        </div>
      )}
    </main>
  );
};

export default VMC;
