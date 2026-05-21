import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Archive,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload
} from 'lucide-react';

const categories = [
  { id: 'school_memorandum', name: 'School Memorandum', group: 'Resources' },
  { id: 'division_memorandum', name: 'Division Memorandum', group: 'Resources' },
  { id: 'deped_memorandum', name: 'DepEd Memorandum', group: 'Resources' },
  { id: 'deped_order', name: 'DepEd Order', group: 'Resources' },
  { id: 'app', name: 'Annual Procurement Plan', group: 'Transparency' },
  { id: 'award_of_contracts', name: 'Award of Contracts', group: 'Transparency' },
  { id: 'bac', name: 'Bids and Awards Committee', group: 'Transparency' },
  { id: 'bid_bulletin', name: 'Bid Bulletin', group: 'Transparency' },
  { id: 'invitation_to_bid', name: 'Invitation to Bid', group: 'Transparency' },
  { id: 'philgeps', name: 'PhilGEPS', group: 'Transparency' },
  { id: 'procurement_reports', name: 'Procurement Reports', group: 'Transparency' },
  { id: 'spta', name: 'SPTA', group: 'Transparency' },
  { id: 'sslg', name: 'SSLG', group: 'Transparency' },
  { id: 'bsp', name: 'BSP', group: 'Transparency' },
  { id: 'gsp', name: 'GSP', group: 'Transparency' },
  { id: 'tr', name: 'TR', group: 'Transparency' },
  { id: 'mooe', name: 'MOOE', group: 'Transparency' },
  { id: 'red_cross', name: 'Red Cross', group: 'Transparency' },
];

const AdminMemoranda = () => {
  const [searchParams] = useSearchParams();
  const initialTable = searchParams.get('table');
  const [activeTable, setActiveTable] = useState(
    categories.some((category) => category.id === initialTable) ? initialTable : categories[0].id
  );
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategory = categories.find((category) => category.id === activeTable) || categories[0];
  const pageLabel = activeCategory.group;

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return records;

    return records.filter((record) =>
      [record.title, record.description, record.date]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [records, searchTerm]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(activeTable)
        .select('*')
        .order('date', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching records:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [activeTable]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchRecords();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchRecords]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const table = searchParams.get('table');
      if (categories.some((category) => category.id === table) && table !== activeTable) {
        setActiveTable(table);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [activeTable, searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      let fileUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const safeTable = activeTable.replace(/[^a-zA-Z0-9_-]/g, '-');
        const fileName = `memo-${safeTable}-${file.lastModified}-${file.size}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('memoranda-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('memoranda-files')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
      }

      const { error } = await supabase.from(activeTable).insert([{
        title,
        description,
        date,
        file: fileUrl,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      setFile(null);
      await fetchRecords();
      alert('Document published successfully!');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;

    try {
      const { error } = await supabase.from(activeTable).delete().eq('id', id);
      if (error) throw error;
      await fetchRecords();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <main className="admin-page mx-auto max-w-[1500px] pb-16 font-outfit text-gray-900">
      <div className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white px-7 py-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <span className="inline-flex items-center rounded-md bg-maroon-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-maroon-800">
                {pageLabel} Management
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                {activeCategory.name}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                Upload, search, and maintain official PDF documents for the public {pageLabel.toLowerCase()} page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:min-w-[360px]">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Documents</p>
                <p className="mt-1 text-3xl font-bold text-gray-950">{records.length}</p>
              </div>
              <div className="rounded-lg border border-maroon-100 bg-maroon-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-maroon-700">File Type</p>
                <p className="mt-1 text-3xl font-bold text-maroon-950">PDF</p>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50/70 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-maroon-800 shadow-sm ring-1 ring-gray-200">
                  <Plus size={21} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-950">Add New Document</h2>
                    <p className="text-sm text-gray-500">Create a record for {activeCategory.name} and attach a PDF file.</p>
                  </div>
                </div>
                <span className="hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 lg:inline-flex">
                  PDF archive entry
                </span>
              </div>

              <form id="uploadForm" onSubmit={handleSubmit} className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                  <div className="lg:col-span-3">
                    <label htmlFor="memoTitle" className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
                    <input
                      type="text"
                      id="memoTitle"
                      name="title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Enter title"
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label htmlFor="memoDate" className="mb-2 block text-sm font-semibold text-gray-700">Date</label>
                    <input
                      type="date"
                      id="memoDate"
                      name="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="memoDescription" className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    id="memoDescription"
                    name="description"
                    rows="4"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Enter description"
                    className="h-28 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                  />
                </div>

                <div>
                  <label htmlFor="docFile" className="mb-2 block text-sm font-semibold text-gray-700">Upload File (PDF Only)</label>
                  <label htmlFor="docFile" className="flex min-h-[136px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-maroon-300 hover:bg-maroon-50/40">
                    <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm ring-1 ring-gray-200">
                      <Upload size={20} />
                    </div>
                    <div className="min-w-0 max-w-full">
                      <span className="block truncate text-sm font-bold text-gray-800">
                        {file ? file.name : 'Choose PDF File'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {file ? 'PDF ready to upload' : 'No file chosen'}
                      </span>
                    </div>
                    <input
                      type="file"
                      id="docFile"
                      className="hidden"
                      accept=".pdf,application/pdf"
                      required
                      onChange={(event) => setFile(event.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Upload'}
                </button>
              </form>
            </section>

          <section className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-white px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                  <FileText size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-950">{pageLabel} Records</h2>
                  <p className="text-sm text-gray-500">{filteredRecords.length} visible records</p>
                </div>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search documents"
                  className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] table-fixed text-left">
                <colgroup>
                  <col className="w-[150px]" />
                  <col className="w-[30%]" />
                  <col />
                  <col className="w-[170px]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Title</th>
                    <th className="px-6 py-3.5">Description</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [1, 2, 3].map((item) => (
                      <tr key={item} className="animate-pulse">
                        <td colSpan={4} className="h-16 bg-gray-50 px-6 py-3"></td>
                      </tr>
                    ))
                  ) : filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="transition hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-700">
                          {record.date
                            ? new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'No date'}
                        </td>
                        <td className="px-6 py-4">
                          <p className="line-clamp-1 text-sm font-semibold text-gray-950">{record.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                            {record.description || 'No description'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {record.file && (
                              <a
                                href={record.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-maroon-200 hover:bg-maroon-50 hover:text-maroon-800"
                              >
                                <ExternalLink size={15} />
                                View
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(record.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-gray-50 text-gray-300">
                          <Archive size={28} />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No documents found for {activeCategory.name}.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminMemoranda;
