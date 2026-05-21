import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import {
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldAlert,
  KeyRound,
  ShieldCheck,
  Home
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
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f7f5] font-outfit text-gray-950">
      <main className="flex h-full flex-col items-center justify-center px-5 py-4">
        <section className="flex w-full max-w-[460px] flex-col items-center">
          <img src={logo} alt="RMNHS Logo" className="mb-2.5 h-[50px] w-auto object-contain" />

          <header className="mb-4 text-center">
            <h1 className="text-[26px] font-extrabold leading-none tracking-tight text-gray-950 sm:text-[29px]">
              RMNHS Admin
            </h1>
            <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-maroon-800/70 sm:text-[11px]">
              School Website CMS
            </p>
          </header>

          <div className="w-full rounded-[1.35rem] border border-gray-200 bg-white p-5 text-gray-950 shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:p-6">
            <header className="mb-6">
              <div className="mb-3 flex justify-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-maroon-50 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-maroon-800">
                  <ShieldCheck size={14} />
                  Secure Portal
                </div>
              </div>
              <h2 className="text-center text-[23px] font-extrabold leading-none tracking-tight text-gray-950">Welcome back</h2>
              <p className="mx-auto mt-2.5 max-w-sm text-center text-[13px] font-semibold leading-5 text-gray-500">
                Sign in to manage official school website content and resources.
              </p>
            </header>

              {error && (
                <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-900">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-500">Authentication Error</p>
                    <p className="mt-1 leading-5">{error}</p>
                  </div>
                </div>
              )}

            <form onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.24em] text-gray-500" htmlFor="admin-email">
                    Email address
                </label>
                <div className="group/input relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within/input:text-maroon-800" size={18} />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rmnhs.edu.ph"
                    className="h-[50px] w-full rounded-[1rem] border border-gray-200 bg-[#fbfbfa] pl-[50px] pr-4 text-[13px] font-bold text-gray-950 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-maroon-700 focus:bg-white focus:ring-4 focus:ring-maroon-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-gray-500" htmlFor="admin-password">
                    Password
                  </label>
                  <button type="button" className="text-[11px] font-extrabold uppercase tracking-wide text-maroon-800 transition hover:text-maroon-950">
                    Forgot?
                  </button>
                </div>
                <div className="group/input relative mt-2">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within/input:text-maroon-800" size={18} />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="h-[50px] w-full rounded-[1rem] border border-gray-200 bg-[#fbfbfa] pl-[50px] pr-14 text-[13px] font-bold text-gray-950 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-maroon-700 focus:bg-white focus:ring-4 focus:ring-maroon-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 transition hover:bg-maroon-50 hover:text-maroon-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex h-[52px] w-full items-center justify-center gap-3 rounded-full bg-maroon-800 px-5 text-[13px] font-extrabold text-white shadow-lg shadow-maroon-950/25 transition hover:-translate-y-0.5 hover:bg-maroon-900 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Logging in
                  </>
                ) : (
                  <>
                    Login to System
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <Link
                to="/"
                className="mt-3 flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white px-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-500 transition hover:border-maroon-100 hover:bg-maroon-50 hover:text-maroon-800"
              >
                <Home size={15} />
                Back to Website
              </Link>
            </form>
          </div>

          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
            Recto Memorial National High School
          </p>
        </section>
      </main>
    </div>
  );
};

export default AdminLogin;
