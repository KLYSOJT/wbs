import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Archive,
  BookOpenCheck,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload
} from 'lucide-react';

const gradeLevels = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

const AdminLearningMaterials = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeGrade, setActiveGrade] = useState('Grade 7');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [quarter, setQuarter] = useState('Quarter 1');
  const [file, setFile] = useState(null);

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return records;

    return records.filter((record) =>
      [record.title, record.subject, record.quarter]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [records, searchTerm]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('learning_materials')
        .select('*')
        .eq('grade', activeGrade)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [activeGrade]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchRecords();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchRecords]);

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setQuarter('Quarter 1');
    setFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      let fileUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const safeGrade = activeGrade.replace(/[^a-zA-Z0-9_-]/g, '-');
        const fileName = `lm-${safeGrade}-${file.lastModified}-${file.size}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('learning-materials')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('learning-materials')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
      }

      const { error } = await supabase.from('learning_materials').insert([{
        title,
        subject,
        grade: activeGrade,
        quarter,
        file_url: fileUrl,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      resetForm();
      await fetchRecords();
      alert('Learning material published!');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return;

    try {
      const { error } = await supabase.from('learning_materials').delete().eq('id', id);
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
                Curriculum Management
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                Learning Materials
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                Upload, filter, and maintain PDF learning resources for the public materials archive.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:min-w-[420px]">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Active Level</p>
                <p className="mt-1 text-2xl font-bold text-gray-950">{activeGrade}</p>
              </div>
              <div className="rounded-lg border border-maroon-100 bg-maroon-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-maroon-700">Materials</p>
                <p className="mt-1 text-3xl font-bold text-maroon-950">{records.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-maroon-50 text-maroon-800">
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-950">Academic Levels</h2>
                <p className="mt-1 text-sm text-gray-500">Choose the grade level before publishing or reviewing materials.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {gradeLevels.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setActiveGrade(grade)}
                  className={`rounded-md border px-4 py-2.5 text-sm font-semibold transition ${
                    activeGrade === grade
                      ? 'border-maroon-800 bg-maroon-800 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-maroon-200 hover:bg-maroon-50 hover:text-maroon-800'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50/70 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-maroon-800 shadow-sm ring-1 ring-gray-200">
                  <Plus size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-950">Add Learning Material</h2>
                  <p className="text-sm text-gray-500">Create a {activeGrade} resource record and attach a PDF file.</p>
                </div>
              </div>
              <span className="w-fit rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500">
                Publishing to {activeGrade}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <label htmlFor="materialTitle" className="mb-2 block text-sm font-semibold text-gray-700">Module Title</label>
                  <input
                    type="text"
                    id="materialTitle"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. SLM Quarter 1 Week 1"
                    required
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label htmlFor="materialQuarter" className="mb-2 block text-sm font-semibold text-gray-700">Academic Period</label>
                  <select
                    id="materialQuarter"
                    value={quarter}
                    onChange={(event) => setQuarter(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                  >
                    <option value="Quarter 1">Quarter 1</option>
                    <option value="Quarter 2">Quarter 2</option>
                    <option value="Quarter 3">Quarter 3</option>
                    <option value="Quarter 4">Quarter 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="materialSubject" className="mb-2 block text-sm font-semibold text-gray-700">Subject Area</label>
                <input
                  type="text"
                  id="materialSubject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="e.g. Mathematics"
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                />
              </div>

              <div>
                <label htmlFor="materialFile" className="mb-2 block text-sm font-semibold text-gray-700">Upload File (PDF Only)</label>
                <label htmlFor="materialFile" className="flex min-h-[136px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-maroon-300 hover:bg-maroon-50/40">
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
                    id="materialFile"
                    className="hidden"
                    accept=".pdf,application/pdf"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <BookOpenCheck size={18} />}
                Publish Material
              </button>
            </form>
          </section>

          <section className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-white px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                  <Layers size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-950">Material Registry</h2>
                  <p className="text-sm text-gray-500">{filteredRecords.length} visible records for {activeGrade}</p>
                </div>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search materials"
                  className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] table-fixed text-left">
                <colgroup>
                  <col className="w-[150px]" />
                  <col className="w-[30%]" />
                  <col />
                  <col className="w-[130px]" />
                  <col className="w-[180px]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-3.5">Quarter</th>
                    <th className="px-6 py-3.5">Title</th>
                    <th className="px-6 py-3.5">Subject</th>
                    <th className="px-6 py-3.5">File</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [1, 2, 3].map((item) => (
                      <tr key={item} className="animate-pulse">
                        <td colSpan={5} className="h-16 bg-gray-50 px-6 py-3"></td>
                      </tr>
                    ))
                  ) : filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="transition hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex rounded-md bg-maroon-50 px-2.5 py-1 text-xs font-semibold text-maroon-800">
                            {record.quarter || 'No quarter'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600">
                              <FileText size={18} />
                            </div>
                            <p className="line-clamp-1 text-sm font-semibold text-gray-950">{record.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="line-clamp-1 text-sm leading-6 text-gray-500">{record.subject || 'No subject'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${record.file_url ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {record.file_url ? 'PDF' : 'Missing'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {record.file_url && (
                              <a
                                href={record.file_url}
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
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-gray-50 text-gray-300">
                          <Archive size={28} />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No learning materials found for {activeGrade}.</p>
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

export default AdminLearningMaterials;
