import transparencySeal from '../../assets/imgs/transparency-seal.png';
import { CheckCircle2, FileText, Gavel, ShieldCheck, Sparkles, ScrollText } from 'lucide-react';
import HeroWaveBackground from '../../components/HeroWaveBackground';

const TransparencyInfo = () => {
  const requirements = [
    'Institutional Mandates & Functions',
    'Directory of High-Level Officials',
    'Annual Financial Reports',
    'Approved Budgets & Strategic Targets',
    'Major Programs & Infrastructure Projects',
    'Implementation & Beneficiary Status',
    'Procurement Plans & Awarded Contracts',
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-36 pb-20 text-white">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="user-screen-container relative z-10">
          <div>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <ShieldCheck size={15} />
                Institutional Accountability
              </div>

              <h1 className="mt-8 whitespace-nowrap text-[clamp(1.5rem,7.5vw,6rem)] font-bold leading-[0.96] tracking-tight sm:text-[clamp(2.25rem,7.5vw,6rem)]">
                Transparency Information
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                Official compliance information for public accountability, agency reporting, and downloadable transparency records.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="user-screen-container">
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Accountability Index</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                A guided view of the school's public reporting duties.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-500 md:text-base">
                Review the legal reference, required disclosure groups, and document access points for transparency compliance.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                  <Gavel size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Sec. 93</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Legal basis</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <ShieldCheck size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">{requirements.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Disclosure groups</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f0eb] text-gray-950">
                  <FileText size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Guide</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Digital circular</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="rounded-[1.5rem] bg-white p-6 text-center shadow-sm ring-1 ring-black/5 md:p-8 lg:sticky lg:top-28">
              <div className="mx-auto flex max-w-xs items-center justify-center">
                <img
                  src={transparencySeal}
                  alt="Transparency Information"
                  className="w-72 max-w-full drop-shadow-[0_24px_48px_rgba(124,10,2,0.12)]"
                />
              </div>
              <div className="mt-8 rounded-2xl bg-[#fbfbfa] p-5 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-maroon-800">Official Compliance</p>
                <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                  The seal links the public to indexed documents required for government transparency and accountability.
                </p>
              </div>
            </aside>

            <div className="space-y-6">
              <article className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-800">
                    <Gavel size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-maroon-800">National Protocol</p>
                    <p className="mt-4 text-xl font-bold leading-8 tracking-tight text-gray-950">
                      National Budget Circular 542 reiterates compliance with Section 93 of the General Appropriations Act of FY2012.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-gray-950 p-6 text-white shadow-sm ring-1 ring-black/5 md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-maroon-200">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Sec. 93</p>
                    <h3 className="mt-1 text-3xl font-bold tracking-tight">Transparency Information</h3>
                  </div>
                </div>

                <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-white/60">
                  To enhance transparency and enforce accountability, national government agencies maintain a transparency seal on their official websites.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {requirements.map((item, idx) => (
                    <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-maroon-200">
                        {idx + 1}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/55">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-maroon-200" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Head of agency accountability verified</span>
                  </div>
                  <div className="h-1 w-12 rounded-full bg-white/10"></div>
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fbfbfa] text-gray-500">
                    <ScrollText size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Administrative Framework</p>
                    <p className="mt-4 text-base font-medium leading-7 text-gray-600">
                      A Transparency Seal displayed on a government agency website certifies compliance and connects visitors to an index of downloadable documents.
                    </p>
                  </div>
                </div>
              </article>

              <div className="flex flex-col justify-between gap-4 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                    <FileText size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Official Compliance Protocol v2.4</span>
                </div>
                <a
                  href="https://blgf.gov.ph/govph-megamenu/national-budget-circular-542/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gray-950 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-maroon-800"
                >
                  <Sparkles size={14} />
                  View Full Digital Circular
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TransparencyInfo;
