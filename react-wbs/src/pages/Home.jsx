import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import welcomeImg from '../assets/imgs/welcome.png';
import makingImg from '../assets/imgs/making.png';
import tatakrectoImg from '../assets/imgs/tatakrecto.png';
import speechlabImg from '../assets/imgs/speechlab.png';
import comlabImg from '../assets/imgs/comlabG11-4.png';
import rectologoImg from '../assets/imgs/rectologo.png';
import coveredcourtImg from '../assets/imgs/coveredcourt.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const slides = [welcomeImg, makingImg, tatakrectoImg];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: annData } = await supabase.from('announcements').select('*').limit(3).order('created_at', { ascending: false });
      const { data: newsData } = await supabase.from('news').select('*').limit(3).order('created_at', { ascending: false });
      
      if (annData) setAnnouncements(annData);
      if (newsData) setNews(newsData);
      setLoading(false);
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex flex-col w-full">
      {/* Carousel Section */}
      <section className="relative w-full aspect-[21/9] lg:aspect-[3/1] overflow-hidden bg-gray-100">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full">
              <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-maroon-800 scale-125' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 w-full py-20 space-y-32">
        
        {/* Announcements Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-maroon-800 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Updates & Bulletins</span>
              <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Announcements</h2>
            </div>
            <button className="bg-maroon-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-maroon-800 transition-all shadow-xl shadow-maroon-900/10 active:scale-95">
              Explore All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-gray-50 animate-pulse rounded-[2.5rem]"></div>)
            ) : announcements.length > 0 ? (
              announcements.map((ann) => (
                <div key={ann.id} className="group bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 transition-all hover:-translate-y-4">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    {ann.image_url && (
                      <img src={ann.image_url} alt={ann.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-maroon-900 shadow-sm">
                        {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-maroon-800 transition-colors">{ann.title}</h3>
                    <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                      {ann.description}
                    </p>
                    <button className="flex items-center gap-2 text-maroon-800 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                      Read Full Update <span className="text-xl">→</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active announcements at this time.</p>
              </div>
            )}
          </div>
        </section>

        {/* Latest News Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">School Journalism</span>
              <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">The Rectorian News</h2>
            </div>
            <button className="text-blue-600 font-black uppercase tracking-widest text-xs hover:underline">
              Visit Press Center
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[2rem]"></div>)
            ) : news.length > 0 ? (
              news.map((n) => (
                <div key={n.id} className="flex flex-col group cursor-pointer">
                  <div className="aspect-[16/10] bg-gray-50 rounded-[2rem] overflow-hidden mb-6 shadow-xl relative">
                    {n.image_url ? (
                      <img src={n.image_url} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    )}
                    <div className="absolute inset-0 bg-maroon-900/0 group-hover:bg-maroon-900/10 transition-all"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-maroon-800"></span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(n.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-maroon-800 transition-colors uppercase tracking-tighter">
                      {n.title}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Stay tuned for the latest news.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Videos Section */}
        <section className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="absolute top-0 right-0 w-96 h-96 bg-maroon-800/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
            <span className="text-maroon-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Visual Experience</span>
            <h2 className="text-5xl font-black text-white mt-2 mb-6 uppercase italic tracking-tighter leading-none">Featured Media</h2>
            <p className="text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">Explore our school's dynamic atmosphere through our official video highlights and media productions.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            <div className="lg:col-span-2 aspect-video rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Featured Video"
                allowFullScreen
              ></iframe>
            </div>
            <div className="space-y-6">
              <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-maroon-600 rounded-full animate-pulse"></span> Official Playlist
              </h3>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group border border-white/5 hover:border-white/10">
                  <div className="w-28 h-18 bg-gray-800 rounded-xl flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-maroon-900">
                        <span className="ml-0.5 text-xs">▶</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white line-clamp-2 leading-tight group-hover:text-maroon-500 transition-colors">School Highlight Event - Segment {i}</h4>
                    <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">RMNS Media • {i}m ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
          <div className="text-center mb-20">
            <span className="text-maroon-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Our Campus</span>
            <h2 className="text-6xl font-black text-maroon-900 uppercase tracking-tighter italic leading-none">Facilities</h2>
            <div className="h-2 w-32 bg-maroon-800 mx-auto mt-8 rounded-full shadow-lg shadow-maroon-800/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Main Facility Card */}
            <div className="lg:col-span-2 h-[500px] rounded-[3rem] overflow-hidden relative group cursor-pointer shadow-2xl shadow-maroon-900/10">
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="absolute top-10 left-10 w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-xl">01</div>
              <div className="absolute bottom-12 left-12">
                <span className="text-white/60 font-black uppercase tracking-[0.2em] text-xs mb-2 block">Learning Environment</span>
                <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Speech Laboratory</h3>
              </div>
              <img src={speechlabImg} alt="Speech Laboratory" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>

            {/* Side Facility Cards */}
            <div className="grid grid-rows-2 gap-10">
              <div className="rounded-[3rem] overflow-hidden relative group cursor-pointer shadow-xl shadow-blue-900/5">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-all duration-500"></div>
                <div className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-sm">02</div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Computer Lab</h3>
                </div>
                <img src={comlabImg} alt="Computer Lab" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="rounded-[3rem] overflow-hidden relative group cursor-pointer shadow-xl shadow-maroon-900/5 text-white">
                <div className="absolute inset-0 bg-maroon-900/90 group-hover:bg-maroon-900/80 transition-all duration-500"></div>
                <div className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center font-black text-sm">03</div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Suarez ICT Lab</h3>
                </div>
                <img src={rectologoImg} alt="Suarez ICT Lab" className="w-full h-full object-contain p-12 bg-white transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>
          </div>
          
          <div className="w-full bg-maroon-900 text-white text-center py-8 mt-20 rounded-[2.5rem] font-black uppercase italic tracking-[0.3em] text-xl lg:text-3xl shadow-2xl shadow-maroon-900/30 overflow-hidden relative group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            Recto Memorial National High School Campus
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
