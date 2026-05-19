import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowRight, Award, Users, GraduationCap, Clock } from 'lucide-react';
import welcomeImg from '../assets/imgs/welcome.png';
import makingImg from '../assets/imgs/making.png';
import tatakrectoImg from '../assets/imgs/tatakrecto.png';
import speechlabImg from '../assets/imgs/speechlab.png';
import comlabImg from '../assets/imgs/comlabG11-4.png';
import coveredcourtImg from '../assets/imgs/coveredcourt.jpg';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [welcomeImg, makingImg, tatakrectoImg];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: annData } = await supabase.from('announcements').select('*').limit(6).order('created_at', { ascending: false });
        if (annData) setAnnouncements(annData);
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
      <section className="py-32 bg-subsurface">
        <div className="max-w-[1440px] mx-auto px-10">
           <div className="flex items-end justify-between mb-16">
              <div className="space-y-4">
                 <h2 className="text-4xl font-bold text-gray-900 tracking-tight italic">Latest Updates & Announcements</h2>
                 <p className="text-gray-500 max-w-lg">Stay informed with the latest happenings, academic schedules, and school events at RMNHS.</p>
              </div>
              <div className="flex gap-4">
                 <button className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"><ArrowRight className="rotate-180" size={20} /></button>
                 <button className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"><ArrowRight size={20} /></button>
              </div>
           </div>

           <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="min-w-[400px] h-[500px] bg-gray-200 animate-pulse rounded-[2.5rem]"></div>)
              ) : announcements.map((ann) => (
                <div key={ann.id} className="min-w-[400px] group cursor-pointer">
                   <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-6">
                      <img src={ann.image_url || makingImg} alt={ann.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                            <Calendar size={12} />
                            {new Date(ann.created_at).toLocaleDateString()}
                         </div>
                         <h3 className="text-2xl font-bold leading-tight">{ann.title}</h3>
                      </div>
                   </div>
                   <p className="text-gray-500 text-sm line-clamp-2 px-4 leading-relaxed">{ann.description}</p>
                </div>
              ))}
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


