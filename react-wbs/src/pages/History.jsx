import { useState } from 'react';
import { ArrowRight, BookOpenText, CalendarDays, Languages, Landmark, Quote } from 'lucide-react';
import oldrecto from '../assets/imgs/oldrecto.png';

const History = () => {
  const [language, setLanguage] = useState('EN');

  const isEnglish = language === 'EN';

  const timeline = [
    { year: '1941', label: 'Founded as Tayabas Academy' },
    { year: '1964', label: 'Renamed Luzonian Institute' },
    { year: '1965', label: 'Became Recto Memorial College' },
    { year: '1970', label: 'Converted into a public high school' },
  ];

  const englishParagraphs = [
    'In 1964 the name was changed to Luzonian Institute and while at the peak of its career and development, the management decided to expand its services due to increase in enrolment and the desire of the townspeople for more educational opportunity.',
    'In 1968, the directorship was assigned to Mrs. Soledad Ananias with a principal, Mrs. Amparo Tome. During the incumbency of Mrs. Tome, there was unrest among the faculty members. They went on strike demanding a salary increase.',
    'The management, unable to meet the demands, decided to make the school public. As a consequence, it was changed into a public school and was named Recto Memorial Provincial High School in July 27, 1970.',
    'Mrs. Francisca Abcede was the first principal to serve the school for almost 7 years. In April 09, 2006, the school was gutted by fire of unknown origin leaving 39 classrooms including offices in ashes. Slowly but definitely however, it rose again.',
    'Today, 19 classrooms have been built with more constructions being laid with the help of prominent figures in the private and public sectors and specifically the Department of Education, ensuring the legacy of Claro M. Recto lives on through every student.',
  ];

  const filipinoParagraphs = [
    'Ang RMNHS ay pinaniniwalaang itinatag noong 1941 at unang nakilala bilang Tayabas Academy na isang pribadong paaralan. Ngunit, noong Hunyo 1, 1948 ang pangalan nito ay napalitan ng Luzonian Institute.',
    'Sa paglipas ng panahon ay napagdesisyunan ng mga namamahala ng paaralan na ito ay gawin nang isang ganap na mataas na paaralang pampubliko at pinangalanang Recto Memorial Provincial High School (RMPHS) noong Hulyo 27, 1970.',
    'Nagsimulang kilalanin ang paaralan bilang Recto Memorial National High School (RMNHS) noong taong panuruan 1993-1994, at patuloy na naglilingkod sa sambayanang Pilipino hanggang sa kasalukuyan.',
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-900 overflow-hidden">
      <section className="relative bg-gradient-to-r from-[#3A0000] via-[#4A0000] to-black pt-36 pb-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(128,0,0,0.4),transparent_34%)]"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-12 items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <Landmark size={15} />
                Historical Profile
              </div>

              <h1 className="mt-8 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
                A legacy shaped by service, resilience, and public education.
              </h1>

              <p className="mt-8 max-w-2xl text-base md:text-lg leading-8 text-white/68">
                From Tayabas Academy to Recto Memorial National High School, the story of RMNHS follows a community's long commitment to accessible learning in Quezon Province.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl shadow-2xl shadow-black/20">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white px-5 py-6 text-gray-950">
                  <p className="text-4xl font-bold tracking-tight">1941</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-400">First opened</p>
                </div>
                <div className="rounded-3xl bg-black/30 px-5 py-6 text-white ring-1 ring-white/10">
                  <p className="text-4xl font-bold tracking-tight">1970</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/40">Public school</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLanguage((prev) => (prev === 'EN' ? 'FIL' : 'EN'))}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-4 text-sm font-bold text-white transition-all hover:bg-white hover:text-maroon-800 active:scale-[0.98]"
              >
                <Languages size={18} />
                {isEnglish ? 'Read in Filipino' : 'Read in English'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <figure className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-maroon-950/10 ring-1 ring-black/5">
                <img
                  src={oldrecto}
                  alt="Old Recto Memorial National High School"
                  className="h-[420px] w-full object-cover grayscale-[0.15]"
                />
                <figcaption className="flex items-center justify-between gap-4 border-t border-gray-100 px-6 py-5">
                  <div>
                    <p className="text-sm font-bold text-gray-950">RMNHS Archive</p>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Historical campus photo</p>
                  </div>
                  <BookOpenText className="text-maroon-800" size={22} />
                </figcaption>
              </figure>

              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-800">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-950">Timeline</p>
                    <p className="text-xs font-medium text-gray-400">Key institutional milestones</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {timeline.map((item) => (
                    <div key={item.year} className="flex gap-4">
                      <div className="w-16 shrink-0 text-sm font-bold text-maroon-800">{item.year}</div>
                      <div className="relative flex-1 border-l border-gray-200 pb-4 pl-5 last:pb-0">
                        <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-maroon-800"></span>
                        <p className="text-sm font-medium leading-6 text-gray-600">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <article className="lg:col-span-7 rounded-[2rem] bg-white p-6 md:p-10 lg:p-12 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-col gap-6 border-b border-gray-100 pb-8 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-maroon-800">
                    {isEnglish ? 'Narrative Record' : 'Tala ng Kasaysayan'}
                  </p>
                  <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-gray-950">
                    {isEnglish ? 'The story of Recto Memorial National High School' : 'Ang kasaysayan ng Recto Memorial National High School'}
                  </h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                  {language}
                  <ArrowRight size={14} />
                </div>
              </div>

              <div className="mt-10 space-y-8 text-base md:text-lg leading-8 text-gray-600">
                <div className="relative rounded-[1.5rem] bg-maroon-50 p-6 md:p-8 text-gray-950">
                  <Quote className="mb-5 text-maroon-800" size={30} />
                  <p className="text-xl md:text-2xl font-bold leading-9 tracking-tight">
                    {isEnglish
                      ? 'The school was formerly the Tayabas Academy, a private school founded in 1941 when Mr. Petronio Pasumbal was the mayor of the town. It flourished for several years and became of great service to nearby towns.'
                      : 'Isa sa pinakamalaking pampublikong paaralan sa lalawigan ng Quezon ang Pambansang Mataas na Paaralang Pang-alaala kay Recto o mas higit na kilala bilang Recto Memorial National High School (RMNHS).'}
                  </p>
                </div>

                {(isEnglish ? englishParagraphs : filipinoParagraphs).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <div className="rounded-[1.5rem] border border-gray-100 bg-[#fbfbfa] p-6 md:p-8">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-maroon-800">
                    {isEnglish ? 'Archive Note' : 'Tala ng Arkibo'}
                  </p>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {isEnglish
                      ? 'This page presents the school profile in a clearer archival format for students, staff, alumni, and community visitors.'
                      : 'Inilalahad ng pahinang ito ang profile ng paaralan sa mas malinaw na anyong pang-arkibo para sa mga mag-aaral, kawani, alumni, at bisita ng komunidad.'}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default History;
