import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowRight, Award, Users, GraduationCap, Clock, Megaphone, Newspaper } from 'lucide-react';
import welcomeImg from '../assets/imgs/welcome.png';
import makingImg from '../assets/imgs/making.png';
import tatakrectoImg from '../assets/imgs/tatakrecto.png';
import speechlabImg from '../assets/imgs/speechlab.png';
import comlabImg from '../assets/imgs/comlabG11-4.png';
import coveredcourtImg from '../assets/imgs/coveredcourt.jpg';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  
  const slides = [welcomeImg, makingImg, tatakrectoImg];
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [annRes, newsRes] = await Promise.all([
          supabase.from('announcements').select('*').order('created_at', { ascending: false }),
          supabase.from('news').select('*').order('created_at', { ascending: false }),
        ]);
        const annData = annRes.data;
        const newsData = newsRes.data;
        if (annData) setAnnouncements(annData);
        if (newsData) setNews(newsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const stats = [
    { icon: <GraduationCap className="text-maroon-800" />, label: 'Students Enrolled', value: '4,500+' },
    { icon: <Users className="text-maroon-800" />, label: 'Expert Educators', value: '180+' },
    { icon: <Award className="text-maroon-800" />, label: 'Years of Excellence', value: '25+' },
    { icon: <Clock className="text-maroon-800" />, label: 'Passing Rate', value: '98%' },
  ];

  const paginateItems = (items, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = (totalItems, currentPage, setPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;

      return (
        <button
          key={pageNumber}
          type="button"
          onClick={() => setPage(pageNumber)}
          className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
            currentPage === pageNumber
              ? 'bg-maroon-800 text-white shadow-lg shadow-maroon-900/20'
              : 'bg-white text-gray-500 border border-gray-100 hover:text-maroon-800 hover:border-maroon-200'
          }`}
        >
          {pageNumber}
        </button>
      );
    });
  };

  const AnnouncementCard = ({ item }) => (
    <article className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
      <div className="h-64 bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-maroon-50 text-maroon-800">
            <Megaphone size={48} />
          </div>
        )}
      </div>
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <Calendar size={12} />
          {new Date(item.created_at).toLocaleDateString()}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{item.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{item.description}</p>
      </div>
    </article>
  );

  const NewsCard = ({ item }) => (
    <article className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
      <div className="h-64 bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-950 text-white">
            <Newspaper size={48} />
          </div>
        )}
      </div>
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <Calendar size={12} />
          {new Date(item.created_at).toLocaleDateString()}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{item.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{item.description}</p>
      </div>
    </article>
  );

  return (
    <div className="flex flex-col w-full bg-white font-outfit overflow-x-hidden">
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide} alt={`Slide ${index}`} className="w-full h-full object-cover" />
              {/* Maroon/Dark Tint Overlay */}
              <div className="absolute inset-0 bg-maroon-950/40 backdrop-brightness-75"></div>
            </div>
          ))}
        </div>

        {/* Vignette / Edge Blur Mask (Simulating the leaf/organic frame) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]"></div>
           <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:radial-gradient(circle,transparent_50%,black_100%)]"></div>
        </div>

        {/* Content - Text removed to favor background image messaging */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-10">

           {/* Carousel Indicators */}
           <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    currentSlide === index ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
           </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-10">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-8 rounded-[2rem] bg-subsurface hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100">
                   <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {stat.icon}
                   </div>
                   <div className="mt-4">
                      <h4 className="text-4xl font-bold text-gray-900">{stat.value}</h4>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="announcements py-32 bg-subsurface">
        <div className="announcements-container max-w-[1440px] mx-auto px-10">
          <h2 className="announcements-title text-4xl font-bold text-gray-900 tracking-tight italic mb-16">Announcements</h2>
          
          <div className="announcements-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="announcementsGrid">
            {loading ? (
              [1, 2, 3].map((item) => (
                <div key={item} className="h-[420px] bg-gray-200 animate-pulse rounded-[2rem]"></div>
              ))
            ) : announcements.length > 0 ? (
              paginateItems(announcements, announcementPage).map((announcement) => (
                <AnnouncementCard key={announcement.id} item={announcement} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-sm font-medium text-gray-400">No announcements available.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination flex justify-center gap-3 mt-12" id="paginationContainer">
            {renderPagination(announcements.length, announcementPage, setAnnouncementPage)}
          </div>
        </div>
      </section>


      {/* Latest News */}
      <section className="latest-news py-32 bg-white">
        <div className="latest-news-container max-w-[1440px] mx-auto px-10">
          <h2 className="latest-news-title text-4xl font-bold text-gray-900 tracking-tight italic mb-16">Latest News</h2>
          <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="newsGrid">
            {loading ? (
              [1, 2, 3].map((item) => (
                <div key={item} className="h-[420px] bg-gray-200 animate-pulse rounded-[2rem]"></div>
              ))
            ) : news.length > 0 ? (
              paginateItems(news, newsPage).map((newsItem) => (
                <NewsCard key={newsItem.id} item={newsItem} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-sm font-medium text-gray-400">No latest news available.</p>
              </div>
            )}
          </div>
          <div className="pagination flex justify-center gap-3 mt-12" id="newsPaginationContainer">
            {renderPagination(news.length, newsPage, setNewsPage)}
          </div>
        </div>
      </section>

      {/* Facilities Bento Grid */}
      <section className="py-32 bg-white">
         <div className="max-w-[1440px] mx-auto px-10">
            <div className="text-center mb-20 space-y-4">
               <h2 className="text-5xl font-bold tracking-tight italic">Our Campus Facilities</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">Providing a conducive learning environment equipped with state-of-the-art laboratories and recreation areas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[900px]">
               <div className="md:col-span-8 relative group overflow-hidden rounded-[3rem] bento-card">
                  <img src={speechlabImg} alt="Speech Lab" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-12 left-12 text-white">
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">01</span>
                     <h3 className="text-4xl font-bold mt-2 italic">Speech Laboratory</h3>
                     <p className="text-white/70 mt-2 max-w-sm">Enhancing linguistic skills with advanced audio-visual equipment.</p>
                  </div>
               </div>

               <div className="md:col-span-4 relative group overflow-hidden rounded-[3rem] bento-card">
                  <img src={comlabImg} alt="Computer Lab" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white">
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">02</span>
                     <h3 className="text-3xl font-bold mt-2 italic">ICT Center</h3>
                  </div>
               </div>

               <div className="md:col-span-5 relative group overflow-hidden rounded-[3rem] bento-card">
                  <img src={coveredcourtImg} alt="Court" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white">
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">03</span>
                     <h3 className="text-3xl font-bold mt-2 italic">Covered Court</h3>
                  </div>
               </div>

               <div className="md:col-span-7 relative group overflow-hidden rounded-[3rem] bento-card">
                  <img src={makingImg} alt="Innovation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/40 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                     <h3 className="text-5xl font-bold text-white tracking-tighter italic">Innovating Education for the Future.</h3>
                     <button className="premium-btn premium-btn-primary mt-8">Explore More <ArrowRight size={18} /></button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Quote Section */}
      <section className="py-40 bg-subsurface overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-bold italic select-none">"</div>
         </div>
         <div className="max-w-4xl mx-auto px-10 text-center relative z-10 space-y-12">
            <GraduationCap size={64} className="mx-auto text-maroon-800 opacity-20" />
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight italic tracking-tight">
               "Education is the most powerful weapon which you can use to change the world."
            </h2>
            <div className="space-y-2">
               <p className="text-lg font-bold text-maroon-800">Nelson Mandela</p>
               <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Inspiration for RMNHS</p>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;


