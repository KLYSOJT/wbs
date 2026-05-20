import { useState } from 'react';
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
  KeyRound,
  LayoutDashboard
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f7f3] p-4 font-outfit md:p-8">
      <div className="absolute inset-x-0 top-0 h-80 bg-[#390606]" />
      <div className="absolute inset-x-0 top-80 h-px bg-[#d9b35d]/40" />

      <div className="relative flex w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-950/10">
        <div className="hidden w-[42%] flex-col justify-between bg-[#390606] p-10 text-white lg:flex">
          <Link to="/" className="inline-flex w-fit items-center gap-3 text-white/70 transition hover:text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08]">
              <ArrowLeft size={18} />
            </div>
            <span className="text-xs font-semibold">Back to website</span>
          </Link>

          <div className="space-y-8">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-[#d9b35d]/30 bg-white p-3 shadow-sm">
              <img src={logo} alt="RMNHS Logo" className="h-full w-full object-contain" />
            </div>
            <div className="space-y-4">
              <span className="inline-flex rounded-md border border-[#d9b35d]/20 bg-[#d9b35d]/10 px-3 py-1 text-xs font-semibold text-[#f3d98a]">
                School Website Administration
              </span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                Recto Memorial National High School
              </h1>
              <p className="max-w-sm text-sm leading-6 text-white/70">
                Manage announcements, documents, learning materials, organizations, research records, and school contact information.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/60">
            <span>RMNHS Admin</span>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#d9b35d]" />
              Secure access
            </div>
          </div>
        </div>

        <div className="flex min-h-[680px] flex-1 flex-col justify-center bg-white p-8 md:p-14">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-maroon-800 lg:hidden">
              <ArrowLeft size={17} />
              Back to website
            </Link>

            <header className="mb-10">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-maroon-100 bg-maroon-50 text-maroon-900">
                  <LayoutDashboard size={23} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-950">Admin Login</h2>
                  <p className="mt-1 text-sm text-gray-500">Sign in to manage official school website content.</p>
                </div>
              </div>
            </header>

            {error && (
              <div className="mb-6 flex items-center gap-4 rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-900">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <ShieldAlert size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="mb-0.5 text-xs uppercase tracking-wide opacity-60">Authentication Error</span>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email address</label>
                <div className="group/input relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within/input:text-maroon-800" size={19} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rmnhs.edu.ph"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="group/input relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within/input:text-maroon-800" size={19} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-12 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-maroon-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-maroon-800" />
                <span className="text-sm font-medium text-gray-500">Keep me signed in</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-maroon-800 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    Sign in
                    <ArrowUpRight size={18} />
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
