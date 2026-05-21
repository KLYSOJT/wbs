import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Clock, Compass, Globe, Landmark, Loader2, Mail, MapPin, Navigation, Phone, X } from 'lucide-react';
import HeroWaveBackground from '../components/HeroWaveBackground';
import schoolMapImg from '../assets/imgs/schoolmap.png';
import rectorians1Img from '../assets/imgs/1.png';
import rectorians2Img from '../assets/imgs/2.png';
import rectorians3Img from '../assets/imgs/3.png';
import rectorians4Img from '../assets/imgs/4.png';
import rectorians5Img from '../assets/imgs/5.png';
import rectorians6Img from '../assets/imgs/6.png';
import rectorians7Img from '../assets/imgs/7.png';
import rectorians8Img from '../assets/imgs/8.png';
import rectorians9Img from '../assets/imgs/9.png';
import rectorians10Img from '../assets/imgs/10.png';

const Location = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [data, setData] = useState({
    address: 'X85C+R5C, Quipot, Tiaong, Quezon',
    phone: '0949 995 1769',
    email: 'rectomns301380@gmail.com',
    hours: 'Mon - Fri - 8:00 AM - 5:00 PM',
    map_url: '',
  });

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const { data: res } = await supabase
          .from('school_config')
          .select('*')
          .eq('key', 'location_info')
          .single();

        if (res) setData(res.value);
      } catch (err) {
        console.error('Error fetching location info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const mapLink = 'https://www.google.com/maps/dir//X85C%2BR5C+Recto+Memorial+National+High+School,+Tiaong,+Quezon+Province/@13.9595646,121.3178121,845m/data=!3m1!1e3!4m16!1m7!3m6!1s0x33bd410df2370493:0x94b24d1b53432d30!2sRecto+Memorial+National+High+School!8m2!3d13.9595646!4d121.320387!16s%2Fg%2F1hc764d3r!4m7!1m0!1m5!1m1!1s0x33bd410df2370493:0x94b24d1b53432d30!2m2!1d121.320387!2d13.9595646?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D';
  const expandMapLink = 'https://www.google.com/maps/@13.9534086,121.3198485,3381m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D';
  const rectorianLetters = [
    { key: 'R1', label: 'R', image: rectorians1Img, aria: 'Open Rectorians image 1' },
    { key: 'E', label: 'E', image: rectorians2Img, aria: 'Open Rectorians image 2' },
    { key: 'C', label: 'C', image: rectorians3Img, aria: 'Open Rectorians image 3' },
    { key: 'T', label: 'T', image: rectorians4Img, aria: 'Open Rectorians image 4' },
    { key: 'O', label: 'O', image: rectorians5Img, aria: 'Open Rectorians image 5' },
    { key: 'R2', label: 'R', image: rectorians6Img, aria: 'Open Rectorians image 6' },
    { key: 'I', label: 'I', image: rectorians7Img, aria: 'Open Rectorians image 7' },
    { key: 'A', label: 'A', image: rectorians8Img, aria: 'Open Rectorians image 8' },
    { key: 'N', label: 'N', image: rectorians9Img, aria: 'Open Rectorians image 9' },
    { key: 'S', label: 'S', image: rectorians10Img, aria: 'Open Rectorians image 10' },
  ];

  useEffect(() => {
    document.body.style.overflow = selectedFacility ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedFacility]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedFacility(null);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-32 pb-20 text-white lg:pt-40 lg:pb-28">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="user-screen-container relative z-10">
          <div>
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <MapPin size={15} />
                Geographic Location
              </div>

              <h1 className="mt-6 whitespace-nowrap text-[clamp(1.5rem,7.5vw,6rem)] font-bold leading-[0.96] tracking-tight sm:text-[clamp(2.25rem,7.5vw,6rem)]">
                Campus Location
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/68 md:text-lg xl:text-xl xl:leading-9">
                Find Recto Memorial National High School, view contact details, and open directions to the campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 py-14 md:py-16 xl:py-20">
        <div className="user-screen-container">
          <div className="overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-[0_24px_70px_rgba(30,0,0,0.10)] ring-1 ring-black/5 xl:p-4">
            <div className="mb-4 flex flex-col justify-between gap-4 px-2 pt-2 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-maroon-800">Campus Guide</p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl xl:text-6xl">Explore the school grounds</h2>
              </div>
              <p className="max-w-xl text-sm font-medium leading-7 text-gray-500 lg:text-right">
                View the campus map and open the Rectorians letter gallery for quick visual highlights around the school.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.25rem] border border-gray-100 bg-[#fbfbfa] p-2.5 xl:p-3">
              <div className="flex items-center justify-between gap-4 px-2 pb-2.5">
                <div>
                  <p className="text-sm font-bold text-gray-950 xl:text-base">Recto Memorial National High School</p>
                  <p className="text-xs font-medium text-gray-500">Campus map overview</p>
                </div>
                <span className="hidden rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-maroon-800 shadow-sm sm:inline-flex">
                  School Map
                </span>
              </div>
              <img
                src={schoolMapImg}
                alt="Map of Recto Memorial National High School"
                className="aspect-[16/9] w-full rounded-[1.25rem] object-contain xl:aspect-[16/8.6]"
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-r from-[#3A0000] via-[#4A0000] to-black p-5 text-white shadow-sm md:p-6 xl:p-7">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div className="max-w-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-white/45">Home of</p>
                  <h3 className="mt-3 text-4xl font-black tracking-tight md:text-5xl xl:text-6xl">Rectorians</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-white/55">
                    Select a letter to preview a campus image in a focused gallery view.
                  </p>
                </div>

                <div className="grid w-full grid-cols-5 gap-2 md:gap-3 lg:max-w-3xl lg:grid-cols-10 xl:gap-3">
                  {rectorianLetters.map((letter) => (
                    <button
                      key={letter.key}
                      type="button"
                      onClick={() => setSelectedFacility(letter)}
                      aria-label={letter.aria}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] text-2xl font-black text-white transition-all hover:-translate-y-1 hover:border-white/40 hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/15 md:text-4xl lg:text-3xl xl:rounded-[1.15rem]"
                    >
                      <img
                        src={letter.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-25"
                      />
                      <span className="relative z-10 transition-colors group-hover:text-maroon-800">
                        {letter.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#f7f7f5] pb-20 pt-0 md:pb-24 xl:pb-28">
        <div className="user-screen-container">
          <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Campus Wayfinder</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                Find the school, reach the office, and preview the route.
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-500 md:text-base">
                Use the contact cards and map panel for quick access to address details, communication channels, and navigation links.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                  <MapPin size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Map</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Campus route</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <Phone size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Call</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Office line</p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f0eb] text-gray-950">
                  <Mail size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-950">Email</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Send inquiry</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="space-y-4 xl:sticky xl:top-28">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6 xl:p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="animate-spin text-maroon-800" size={32} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading details</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { icon: <MapPin size={18} />, label: 'Mailing Address', value: data.address },
                      { icon: <Phone size={18} />, label: 'Direct Line', value: data.phone },
                      { icon: <Mail size={18} />, label: 'Digital Mail', value: data.email },
                      { icon: <Clock size={18} />, label: 'Operating Hours', value: data.hours },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#fbfbfa] p-3.5 transition-all hover:border-maroon-100 hover:bg-white">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-maroon-800 shadow-sm ring-1 ring-black/5">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
                          <p className="mt-1 break-words text-sm font-bold leading-6 text-gray-950">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#3A0000] via-[#4A0000] to-black p-5 text-white shadow-sm md:p-6 xl:p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-maroon-200">
                  <Compass size={20} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Navigation Guide</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-white/55">
                  Recto Memorial National High School is situated in the municipality of Tiaong and is accessible via public transport from the Maharlika Highway.
                </p>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-950 transition-all hover:bg-maroon-50"
                >
                  Launch Directions <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div>
              <div className="overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-black/5 xl:p-4">
                <div className="mb-3 flex flex-col justify-between gap-3 px-2 pt-2 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800">
                      <Landmark size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-950">The Recto Memorial Campus</p>
                      <p className="text-xs font-medium text-gray-500">{data.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Globe size={14} />
                    Satellite View
                  </div>
                </div>

                <div className="h-[500px] overflow-hidden rounded-[1.25rem] border border-gray-100 bg-[#fbfbfa] xl:h-[620px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15485.45717320015!2d121.312918!3d13.931448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd455555555555%3A0x7d7d7d7d7d7d7d7d!2sRecto%20Memorial%20National%20High%20School!5e0!3m2!1sen!2sph!4v1715560000000!5m2!1sen!2sph"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Campus Location"
                  />
                </div>

                <div className="flex flex-col justify-between gap-4 px-2 py-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                    <Navigation size={18} className="text-maroon-800" />
                    Open the route in Google Maps for live directions.
                  </div>
                  <a
                    href={expandMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-gray-950 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-maroon-800"
                  >
                    Expand Map <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedFacility && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-950/85 p-4 backdrop-blur-md"
          role="presentation"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            className="relative inline-flex max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Facility image preview"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedFacility(null)}
              aria-label="Close image preview"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-950 shadow-lg transition-all hover:bg-maroon-800 hover:text-white"
            >
              <X size={20} />
            </button>
            <img
              src={selectedFacility.image}
              alt={`Rectorians image for letter ${selectedFacility.label}`}
              className="block h-auto w-auto max-h-[calc(100vh-8rem)] max-w-[calc(100vw-2rem)] bg-[#f7f7f5] object-contain"
            />
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rectorians Gallery</p>
                <p className="mt-1 text-lg font-bold text-gray-950">Letter {selectedFacility.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                className="rounded-full bg-gray-950 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-maroon-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Location;
