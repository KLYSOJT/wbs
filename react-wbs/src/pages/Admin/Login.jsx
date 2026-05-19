import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck,
  ArrowUpRight,
  ShieldAlert,
  Fingerprint,
  KeyRound,
  Command
} from 'lucide-react';
import logo from '../../assets/imgs/rectologo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-8 font-outfit overflow-hidden relative">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(128,0,0,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_100%_100%,rgba(128,0,0,0.05),transparent_50%)] pointer-events-none"></div>
      
      <div className="w-full max-w-6xl bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row relative border border-white/10">
        
        {/* Left Side: Brand Identity */}
        <div className="lg:w-[45%] bg-maroon-950 p-12 md:p-20 text-white flex flex-col justify-between relative overflow-hidden group">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
          
          <Link to="/" className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-all duration-500 group/back z-10">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/back:bg-white group-hover/back:text-maroon-950 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold uppercase tracking-[0.3em] text-[10px]">Return to Portal</span>
          </Link>

          <div className="z-10 space-y-10">
            <div className="relative inline-block">
               <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <img src={logo} alt="RMNHS Logo" className="w-32 h-32 relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-105" />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-px w-8 bg-maroon-500"></div>
                 <span className="text-maroon-400 font-bold uppercase tracking-[0.5em] text-[10px]">Institutional Gateway</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.9] font-['Playfair_Display'] italic">
                Recto Memorial <br />
                <span className="text-maroon-500">National</span> <br />
                High School
              </h1>
              <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm italic">
                Authorized access only. Secure operational environment for institutional management.
              </p>
            </div>
          </div>

          <div className="z-10 flex items-center justify-between">
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
              &copy; 2026 RMNS INFRASTRUCTURE
            </div>
            <div className="flex items-center gap-4 opacity-20">
               <ShieldCheck size={16} />
               <Fingerprint size={16} />
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Console */}
        <div className="lg:w-[55%] p-10 md:p-24 flex flex-col justify-center relative bg-white">
          <div className="max-w-md mx-auto w-full relative z-10">
            <header className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-maroon-50 rounded-2xl flex items-center justify-center text-maroon-900 shadow-xl border border-maroon-100">
                    <Command size={24} />
                 </div>
                 <div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tighter font-['Playfair_Display'] italic leading-none">Access Portal</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Command Center Login</p>
                 </div>
              </div>
            </header>

            {error && (
              <div className="mb-10 p-6 bg-red-50 rounded-[2rem] border border-red-100 text-red-900 text-[11px] font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0 shadow-lg shadow-red-200/50">
                   <ShieldAlert size={20} />
                </div>
                <div className="flex flex-col">
                   <span className="uppercase tracking-widest opacity-40 mb-0.5">Authentication Error</span>
                   {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-6 block">Administrative ID</label>
                <div className="relative group/input">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-maroon-800 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rmnhs.edu.ph"
                    className="w-full bg-gray-50 border border-gray-100 rounded-full pl-16 pr-8 py-6 text-sm font-bold focus:bg-white focus:ring-[12px] focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-6 block">Access Key</label>
                <div className="relative group/input">
                  <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-maroon-800 transition-colors" size={20} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-full pl-16 pr-16 py-6 text-sm font-bold focus:bg-white focus:ring-[12px] focus:ring-maroon-50 focus:border-maroon-800 outline-none transition-all placeholder:text-gray-300"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-maroon-800 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 px-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer hidden" />
                    <div className="w-6 h-6 border-2 border-gray-100 rounded-lg bg-gray-50 peer-checked:bg-maroon-900 peer-checked:border-maroon-900 transition-all duration-300 flex items-center justify-center">
                       <ShieldCheck size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Trust this terminal</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-maroon-950 text-white py-7 rounded-full font-bold uppercase tracking-[0.5em] text-[10px] shadow-2xl shadow-maroon-950/20 hover:bg-black active:scale-95 disabled:opacity-20 transition-all duration-500 flex items-center justify-center gap-6 group/submit relative overflow-hidden"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Fingerprint size={24} className="text-maroon-500" />
                    Initialize Command Access
                    <ArrowUpRight size={20} className="opacity-40 group-hover/submit:opacity-100 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-all" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
