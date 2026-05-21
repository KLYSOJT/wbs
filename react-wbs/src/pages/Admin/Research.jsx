import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Upload,
  Trash2,
  Loader2,
  Plus,
  BookOpen,
  Tag,
  GraduationCap,
  ImageIcon,
  ExternalLink,
  BookMarked,
  FlaskConical,
  FileText,
  Search
} from 'lucide-react';

const AdminResearch = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState('Action Research');
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('research')
        .select('*')
        .order('created_at', { ascending: false });
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching research:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchRecords();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchRecords]);

  const handleUpload = async (selectedFile, bucket) => {
    if (!selectedFile) return null;
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${bucket}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, selectedFile);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const resetForm = () => {
    setTitle('');
    setDepartment('');
    setGrade('');
    setFile(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fileUrl = await handleUpload(file, 'research-pdfs');
      const imageUrl = await handleUpload(imageFile, 'research-covers');

      const payload = {
        title,
        department,
        grade,
        year: parseInt(year),
        category,
        file: fileUrl,
        image: imageUrl,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('research').insert([payload]);
      if (error) throw error;

      resetForm();
      await fetchRecords();
      alert('Research paper published successfully!');
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this research record?')) return;
    try {
      await supabase.from('research').delete().eq('id', id);
      await fetchRecords();
    } catch {
      alert('Delete failed');
    }
  };

  const filteredRecords = records.filter((record) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [record.title, record.department, record.grade, record.category, record.year]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  return (
    <main className="admin-page mx-auto max-w-[1500px] space-y-6 pb-16 font-outfit text-gray-900">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <span className="inline-flex items-center rounded-md bg-maroon-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-maroon-800">
              Academic Repository
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">Research Management</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Upload and maintain scholarly works, action research, and innovation records for the public research archive.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:min-w-[360px]">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Research Papers</p>
              <p className="mt-1 text-3xl font-bold text-gray-950">{records.length}</p>
            </div>
            <div className="rounded-lg border border-maroon-100 bg-maroon-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-maroon-700">Archive Type</p>
              <p className="mt-1 text-2xl font-bold text-maroon-950">PDF</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50/70 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-maroon-800 shadow-sm ring-1 ring-gray-200">
              <Plus size={21} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-950">Add Research Paper</h2>
              <p className="text-sm text-gray-500">Create a research record and attach its PDF and optional cover image.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Research Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter full research title"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
              >
                <option value="">Select department</option>
                <option value="science">Science</option>
                <option value="math">Mathematics</option>
                <option value="english">English</option>
                <option value="ap">Social Studies</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Grade Level</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
              >
                <option value="">Select grade</option>
                <option value="grade-7">Grade 7</option>
                <option value="grade-8">Grade 8</option>
                <option value="grade-9">Grade 9</option>
                <option value="grade-10">Grade 10</option>
                <option value="grade-11">Grade 11</option>
                <option value="grade-12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
              >
                <option value="Action Research">Action Research</option>
                <option value="Applied Research">Applied Research</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Research PDF</label>
              <label className="flex min-h-[128px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-maroon-300 hover:bg-maroon-50/40">
                <Upload size={22} className="text-gray-500" />
                <span className="mt-3 w-full truncate text-sm font-bold text-gray-800">
                  {file ? file.name : 'Choose PDF File'}
                </span>
                <span className="mt-1 text-xs text-gray-500">PDF file for public viewing</span>
                <input type="file" className="hidden" accept=".pdf,application/pdf" onChange={(e) => setFile(e.target.files[0])} />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Cover Image</label>
              <label className="flex min-h-[128px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-maroon-300 hover:bg-maroon-50/40">
                <ImageIcon size={22} className="text-gray-500" />
                <span className="mt-3 w-full truncate text-sm font-bold text-gray-800">
                  {imageFile ? imageFile.name : 'Choose Cover Image'}
                </span>
                <span className="mt-1 text-xs text-gray-500">Optional JPG, PNG, or WEBP image</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <BookOpen size={18} />}
            Publish Research
          </button>
        </form>
      </section>

      <section className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gray-100 text-gray-700">
              <FlaskConical size={21} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-950">Research Registry</h2>
              <p className="text-sm text-gray-500">{filteredRecords.length} visible records</p>
            </div>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search research"
              className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            [1, 2, 3].map((item) => (
              <div key={item} className="h-28 animate-pulse bg-gray-50" />
            ))
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-gray-50 text-gray-300">
                <BookMarked size={28} />
              </div>
              <p className="text-sm font-medium text-gray-500">No research records found.</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <article key={record.id} className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    {record.image ? (
                      <img src={record.image} className="h-full w-full object-cover" alt="Research cover" />
                    ) : (
                      <FileText size={28} className="text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-base font-bold text-gray-950">{record.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-maroon-50 px-2.5 py-1 text-xs font-semibold text-maroon-800">
                        <BookOpen size={13} />
                        {record.category || 'Uncategorized'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        <GraduationCap size={13} />
                        {record.grade || 'No grade'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        <Tag size={13} />
                        {record.department || 'No department'}
                      </span>
                      <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {record.year || 'No year'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
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
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminResearch;
