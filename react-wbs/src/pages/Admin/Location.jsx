import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader2,
  Globe,
  Settings,
  Save
} from 'lucide-react';

const AdminLocation = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    address: 'X85C+R5C, Quipot, Tiaong, Quezon',
    phone: '0949 995 1769',
    email: 'rectomns301380@gmail.com',
    hours: 'Mon - Fri - 7:30 - 4:30',
    map_url: ''
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await supabase
        .from('school_config')
        .select('*')
        .eq('key', 'location_info')
        .single();

      if (res) setData(res.value);
    } catch (err) {
      console.error('Error fetching location config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('school_config')
        .upsert({
          key: 'location_info',
          value: data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Location information updated successfully!');
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-page mx-auto max-w-[1200px] space-y-6 pb-16 font-outfit text-gray-900">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center rounded-md bg-maroon-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-maroon-800">
              School Information
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">Location and Contact</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Update the official address, contact details, and office hours shown on the public website.
            </p>
          </div>

          <div className="rounded-lg border border-maroon-100 bg-maroon-50 px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-maroon-800 shadow-sm">
                <Globe size={21} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-maroon-700">Public Page</p>
                <p className="mt-1 text-lg font-bold text-maroon-950">Location</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50/70 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-maroon-800 shadow-sm ring-1 ring-gray-200">
            <Settings size={21} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-950">Contact Details</h2>
            <p className="text-sm text-gray-500">Changes are reflected on the public website after saving.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 animate-pulse rounded-md bg-gray-50" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin size={16} className="text-maroon-800" />
                Physical Address
              </label>
              <textarea
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="Enter official school address"
                className="h-32 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Phone size={16} className="text-maroon-800" />
                  Contact Number
                </label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="Official phone number"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail size={16} className="text-maroon-800" />
                  Official Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="school@example.com"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock size={16} className="text-maroon-800" />
                  Office Hours
                </label>
                <input
                  type="text"
                  value={data.hours}
                  onChange={(e) => setData({ ...data, hours: e.target.value })}
                  placeholder="Mon - Fri - 7:30 - 4:30"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-maroon-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default AdminLocation;
