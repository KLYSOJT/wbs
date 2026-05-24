import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Upload, 
  Trash2, 
  ImageIcon, 
  Loader2, 
  Building2,
  Landmark,
  RefreshCw
} from 'lucide-react';

const departments = [
  { id: 'AP', name: 'AP' },
  { id: 'English', name: 'English' },
  { id: 'Filipino', name: 'Filipino' },
  { id: 'MAPEH', name: 'MAPEH' },
  { id: 'Math', name: 'Math' },
  { id: 'TLE', name: 'TLE' },
  { id: 'Values Education', name: 'Values Education' },
  { id: 'Science', name: 'Science' },
];

const AdminOrgStructure = () => {
  const [departmentRecords, setDepartmentRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingDept, setSubmittingDept] = useState('');

  const fetchDepartmentRecords = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizational_structure')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const recordsByDepartment = (data || []).reduce((acc, record) => {
        acc[record.department] = record;
        return acc;
      }, {});

      setDepartmentRecords(recordsByDepartment);
    } catch (err) {
      console.error('Error fetching dept data:', err);
      setDepartmentRecords({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchDepartmentRecords();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchDepartmentRecords]);

  const handleUpload = async (department, selectedFile, uploadStamp) => {
    if (!selectedFile) return;
    
    setSubmittingDept(department.id);
    try {
      const existingRecord = departmentRecords[department.id];
      const fileExt = selectedFile.name.split('.').pop();
      const safeDepartment = department.id.replace(/\s+/g, '-').toLowerCase();
      const fileName = `org-${safeDepartment}-${selectedFile.lastModified}-${selectedFile.size}-${Math.round(uploadStamp)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('organizational-charts')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('organizational-charts')
        .getPublicUrl(fileName);

      const payload = {
        department: department.id,
        image: publicUrl,
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('organizational_structure')
        .upsert(payload, { onConflict: 'department' });

      if (upsertError) throw upsertError;

      await fetchDepartmentRecords();
      alert('Department chart updated successfully!');
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setSubmittingDept('');
    }
  };

  const handleDelete = async (department) => {
    if (!window.confirm('Remove this organizational chart?')) return;
    try {
      const { error } = await supabase
        .from('organizational_structure')
        .delete()
        .eq('department', department.id);

      if (error) throw error;
      await fetchDepartmentRecords();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const publishedCount = Object.keys(departmentRecords).length;
  const formatUpdatedDate = (dateValue) => {
    if (!dateValue) return '--';

    return new Date(dateValue).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <main className="admin-page mx-auto max-w-[1440px] pb-16 font-outfit text-gray-900">
      <div className="space-y-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <span className="inline-flex items-center rounded-md bg-maroon-50 px-3 py-1 text-xs font-semibold text-maroon-800">
            About Section
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
            Organizational Structure
          </h1>
        </section>

        <section className="space-y-6">
          <aside className="space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-maroon-50 text-maroon-800">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-950">Department Overview</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Manage the images used for the public organizational structure display.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Departments</span>
                  <strong className="mt-3 block text-3xl font-bold text-gray-950">{departments.length}</strong>
                  <small className="mt-2 block text-sm leading-6 text-gray-500">
                    All available department panels shown on the public organizational structure page.
                  </small>
                </div>
                <div className="rounded-lg border border-maroon-100 bg-maroon-50 p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-maroon-700">Published Charts</span>
                  <strong className="mt-3 block text-3xl font-bold text-maroon-950">{publishedCount}</strong>
                  <small className="mt-2 block text-sm leading-6 text-maroon-700/80">
                    Uploaded image records currently saved for departments.
                  </small>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Content Type</span>
                  <strong className="mt-3 block text-3xl font-bold text-gray-950">Image</strong>
                  <small className="mt-2 block text-sm leading-6 text-gray-500">
                    Upload a replacement image per department without changing the current workflow.
                  </small>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <h3 className="text-base font-bold text-amber-950">Upload Tip</h3>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Use clean, landscape-oriented images so each department card stays balanced and readable on desktop and mobile.
              </p>
            </div>
          </aside>

          <div>
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-200 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-950">Department</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    Select a department and replace its image when you need to refresh the organizational structure display.
                  </p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-md border border-maroon-100 bg-maroon-50 px-3 py-2 text-sm font-semibold text-maroon-800">
                  <Landmark size={16} />
                  About Section
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 2xl:grid-cols-3">
                {departments.map((department) => {
                  const record = departmentRecords[department.id];
                  const inputId = `org-chart-${department.id.replace(/\s+/g, '-').toLowerCase()}`;
                  const isSubmitting = submittingDept === department.id;

                  return (
                    <article
                      key={department.id}
                      data-title={department.name}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-maroon-200 hover:shadow-md"
                    >
                      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-gray-50">
                        {loading ? (
                          <Loader2 className="animate-spin text-maroon-800" size={28} />
                        ) : record?.image ? (
                          <img
                            src={record.image}
                            alt={`${department.name} organizational chart`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-white text-gray-300 shadow-sm">
                              <ImageIcon size={28} />
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-500">No image uploaded</p>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-gray-950">{department.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Updated: {formatUpdatedDate(record?.updated_at)}
                            </p>
                          </div>
                          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${record?.image ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {record?.image ? 'Live' : 'Empty'}
                          </span>
                        </div>

                        <div className="mt-5 flex gap-2">
                          <input
                            id={inputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isSubmitting}
                            onChange={(event) => {
                              const selectedFile = event.target.files?.[0];
                              handleUpload(department, selectedFile, event.timeStamp);
                              event.target.value = '';
                            }}
                          />
                          <label
                            htmlFor={inputId}
                            className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-white transition ${isSubmitting ? 'bg-maroon-700 opacity-70' : 'bg-maroon-800 hover:bg-maroon-900'}`}
                          >
                            {isSubmitting ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : record?.image ? (
                              <RefreshCw size={16} />
                            ) : (
                              <Upload size={16} />
                            )}
                            {record?.image ? 'Change Image' : 'Upload Image'}
                          </label>

                          {record?.image && (
                            <button
                              type="button"
                              onClick={() => handleDelete(department)}
                              className="inline-flex items-center justify-center rounded-md border border-gray-200 px-3 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                              aria-label={`Remove ${department.name} chart`}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminOrgStructure;
