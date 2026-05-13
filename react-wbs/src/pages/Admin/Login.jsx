import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-['Roboto']">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-maroon-800"></div>
      
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Left Side: Brand */}
        <div className="md:w-5/12 bg-maroon-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group z-10">
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            <span className="font-bold uppercase tracking-widest text-xs">Back to Website</span>
          </Link>

          <div className="z-10">
            <img src={logo} alt="RMNHS Logo" className="w-24 h-24 mb-8 drop-shadow-2xl" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none">Recto Memorial <br />National <br />High School</h1>
            <p className="text-white/60 font-medium tracking-wide">Digital Operations & Management Portal</p>
          </div>

          <div className="z-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            &copy; 2026 RMNS INFRASTRUCTURE
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-10">
              <span className="inline-flex items-center gap-2 bg-maroon-50 text-maroon-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <ShieldCheck size={14} /> Secure Admin Access
              </span>
              <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Welcome Back</h2>
              <p className="text-gray-400 font-medium">Enter your credentials to access the command center.</p>
            </header>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top duration-300">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600">!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon-800 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rmnhs.edu.ph"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-maroon-100 focus:border-maroon-800 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-maroon-800 transition-colors" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold focus:ring-4 focus:ring-maroon-100 focus:border-maroon-800 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-maroon-800 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-maroon-800 focus:ring-maroon-800 transition-all cursor-pointer" />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Remember this device</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-maroon-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-maroon-900/20 hover:bg-maroon-800 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Access Admin</span>
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
