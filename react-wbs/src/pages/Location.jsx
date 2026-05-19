import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Clock, Compass, Globe, Landmark, Loader2, Mail, MapPin, Navigation, Phone, Search } from 'lucide-react';
import HeroWaveBackground from '../components/HeroWaveBackground';

const Location = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    address: 'X85C+R5C, Quipot, Tiaong, Quezon',
    phone: '0949 995 1769',
    email: 'rectomns301380@gmail.com',
    hours: 'Mon - Fri - 7:30 - 4:30',
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

  const mapLink = data.map_url || 'https://maps.google.com/?q=Recto+Memorial+National+High+School';

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-outfit text-gray-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.10)_0%,transparent_30%),linear-gradient(135deg,#210000_0%,#430505_42%,#120505_72%,#030303_100%)] pt-36 pb-20 text-white">
        <HeroWaveBackground />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent"></div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
                <MapPin size={15} />
                Geographic Location
              </div>

              <h1 className="mt-8 text-5xl font-bold leading-[0.96] tracking-tight md:text-7xl lg:text-8xl">
                Campus Location
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                Find Recto Memorial National High School, view contact details, and open directions to the campus.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
              <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-5 text-gray-950">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-800">
                  <Compass size={22} />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">RMNHS</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Tiaong, Quezon</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/18 px-5 py-4">
                <Search size={18} className="text-white/50" />
                <p className="text-sm font-medium text-white/68">Use the map panel for directions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800">Campus Directory</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">Contact and map information</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-500">
              Location details are maintained by the school administration and may be updated as official channels change.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-1">
              <div className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="animate-spin text-maroon-800" size={32} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading details</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { icon: <MapPin size={18} />, label: 'Mailing Address', value: data.address },
                      { icon: <Phone size={18} />, label: 'Direct Line', value: data.phone },
                      { icon: <Mail size={18} />, label: 'Digital Mail', value: data.email },
                      { icon: <Clock size={18} />, label: 'Operating Hours', value: data.hours },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#fbfbfa] p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-maroon-800 shadow-sm">
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

              <div className="rounded-[1.5rem] bg-gray-950 p-6 text-white shadow-sm md:p-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-maroon-200">
                  <Compass size={20} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Navigation Guide</h3>
                <p className="mt-4 text-sm font-medium leading-7 text-white/55">
                  Recto Memorial National High School is situated in the municipality of Tiaong and is accessible via public transport from the Maharlika Highway.
                </p>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-950 transition-all hover:bg-maroon-50"
                >
                  Launch Directions <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="mb-4 flex flex-col justify-between gap-3 px-2 pt-2 md:flex-row md:items-center">
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

                <div className="h-[560px] overflow-hidden rounded-[1.25rem] border border-gray-100 bg-[#fbfbfa]">
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

                <div className="flex flex-col justify-between gap-4 px-2 py-5 md:flex-row md:items-center">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                    <Navigation size={18} className="text-maroon-800" />
                    Open the route in Google Maps for live directions.
                  </div>
                  <a
                    href={mapLink}
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
    </main>
  );
};

export default Location;
