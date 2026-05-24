import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toEmbedUrl } from '../../lib/videoUtils';
import { 
  Megaphone, 
  Newspaper, 
  Upload, 
  Trash2, 
  Loader2,
  Plus,
  BarChart3,
  Globe,
  ArrowUpRight,
  PlayCircle,
  Video
} from 'lucide-react';
import { useAuth } from '../../lib/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const lastAutoFetchKeyRef = useRef('');
  const sectionParam = searchParams.get('section');
  const activeSection = ['announcement', 'news', 'videos'].includes(sectionParam) ? sectionParam : 'announcement';
  const isNewsSection = activeSection === 'news';
  const isVideoSection = activeSection === 'videos';
  const activeRecords = isVideoSection ? videos : isNewsSection ? news : announcements;
  const sectionMeta = isVideoSection
    ? {
        eyebrow: 'Media Publishing',
        title: 'Video Management',
        description: 'Manage featured clips, campaign videos, and external media links for the public homepage.',
        composerTitle: 'Featured Videos',
        composerDescription: 'Upload a video file or publish an external video URL.',
        feedTitle: 'Published Videos',
        assetLabel: 'Video Source',
        assetValue: 'File / URL',
        mediaLabel: 'Video Library',
        Icon: Video,
        iconClass: 'bg-indigo-50 text-indigo-700'
      }
    : isNewsSection
      ? {
          eyebrow: 'Press Publishing',
          title: 'News Management',
          description: 'Create, review, and remove public news articles with supporting images.',
          composerTitle: 'News Article',
          composerDescription: 'Draft a news headline, story body, and optional image.',
          feedTitle: 'News Feed',
          assetLabel: 'Media Support',
          assetValue: 'Images',
          mediaLabel: 'Article Library',
          Icon: Newspaper,
          iconClass: 'bg-slate-100 text-slate-700'
        }
      : {
          eyebrow: 'Notice Publishing',
          title: 'Announcement Management',
          description: 'Publish important notices and keep current announcements easy to maintain.',
          composerTitle: 'Announcements',
          composerDescription: 'Write an announcement and attach an optional image.',
          feedTitle: 'Live Announcements',
          assetLabel: 'Media Support',
          assetValue: 'Images',
          mediaLabel: 'Notice Library',
          Icon: Megaphone,
          iconClass: 'bg-maroon-50 text-maroon-800'
        };
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [videoType, setVideoType] = useState('file');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const table = isVideoSection ? 'featured_videos' : isNewsSection ? 'news' : 'announcements';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;

      if (isVideoSection) {
        setVideos(data || []);
      } else if (isNewsSection) {
        setNews(data || []);
      } else {
        setAnnouncements(data || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoadError(err.message || 'Unable to load dashboard content.');
    } finally {
      setLoading(false);
    }
  }, [isNewsSection, isVideoSection]);

  useEffect(() => {
    if (lastAutoFetchKeyRef.current === activeSection) return;
    lastAutoFetchKeyRef.current = activeSection;

    fetchData();
  }, [activeSection, fetchData]);

  const handlePublish = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const table = isVideoSection ? 'featured_videos' : isNewsSection ? 'news' : 'announcements';
    const storageBucket = isVideoSection ? 'featured-videos' : isNewsSection ? 'news-images' : 'announcement-images';
    const trimmedDescription = description.trim();
    const fallbackTitle = trimmedDescription.length > 70
      ? `${trimmedDescription.slice(0, 70)}...`
      : trimmedDescription;
    const typedTitle = isNewsSection || isVideoSection ? title.trim() : '';
    const publishTitle = typedTitle || fallbackTitle || (isVideoSection ? 'Untitled video' : 'Untitled announcement');

    try {
      let publicAssetUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from(storageBucket).upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from(storageBucket).getPublicUrl(fileName);
        publicAssetUrl = publicUrl;
      }

      const payload = isVideoSection
        ? {
            title: publishTitle,
            description: trimmedDescription,
            // Normalize any YouTube URL to embed format so it works in iframes
            video_url: toEmbedUrl(videoType === 'url' ? videoUrl.trim() : publicAssetUrl),
            created_at: new Date().toISOString()
          }
        : { 
            title: publishTitle, 
            description: trimmedDescription, 
            image_url: publicAssetUrl,
            created_at: new Date().toISOString()
          };

      const { error: insertError } = await supabase.from(table).insert([payload]);

      if (insertError) throw insertError;

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setVideoUrl('');
      setVideoType('file');
      await fetchData();
      alert('Content published successfully!');
    } catch (err) {
      console.error('Publish error:', err);
      alert(`Publish failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete operation failed.');
    }
  };

  return (
    <div className="admin-page mx-auto max-w-[1440px] space-y-8 pb-16 font-outfit text-gray-900">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center rounded-md bg-maroon-50 px-3 py-1 text-xs font-semibold text-maroon-800">
              Admin workspace
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {isVideoSection ? 'Video Management' : isNewsSection ? 'News Management' : 'Announcement Management'}
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Signed in as <span className="font-semibold text-gray-900">{user?.email || 'Admin'}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live assets</p>
                  <p className="mt-1 text-3xl font-bold text-gray-950">{activeRecords.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-maroon-800 shadow-sm">
                  <BarChart3 size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-maroon-100 bg-maroon-50 px-5 py-4">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-maroon-700">System status</p>
                  <p className="mt-1 text-2xl font-bold text-maroon-950">Operational</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-maroon-800 shadow-sm">
                  <Globe size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="overview-strip grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="overview-tile rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Publishing Areas</span>
          <strong className="mt-3 block text-3xl font-bold text-gray-950">3</strong>
          <small className="mt-2 block text-sm leading-6 text-gray-500">Current records in this section.</small>
        </article>
        <article className="overview-tile rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Media Support</span>
          <strong className="mt-3 block text-3xl font-bold text-gray-950">Images</strong>
          <small className="mt-2 block text-sm leading-6 text-gray-500">Attach visuals to announcement and news posts.</small>
        </article>
        <article className="overview-tile rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Video Source</span>
          <strong className="mt-3 block text-3xl font-bold text-gray-950">File / URL</strong>
          <small className="mt-2 block text-sm leading-6 text-gray-500">Upload directly or use an external link.</small>
        </article>
      </section>

      <section className="dashboard-grid grid grid-cols-1 gap-6">
        {loadError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Unable to load {sectionMeta.feedTitle.toLowerCase()}: {loadError}
          </div>
        )}

        {/* Sidebar: Content Composer */}
        <div>
          <article className="panel-card column rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {isVideoSection ? (
              <>
                <div className="panel-heading mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-maroon-50 text-maroon-800">
                    <Video size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-950">Featured Videos</h2>
                    <p className="text-sm text-gray-500">Upload a video file or publish an external video URL.</p>
                  </div>
                </div>

                <form id="videoForm" onSubmit={handlePublish} className="space-y-5">
                  <div>
                    <label htmlFor="videoTitle" className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
                    <input
                      type="text"
                      id="videoTitle"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="videoDescription" className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      id="videoDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Short description of the video (shown under the player on the homepage)..."
                      className="h-24 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                    />
                  </div>

                  <div className="radio-group grid grid-cols-2 gap-3">
                    <label className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${videoType === 'file' ? 'border-maroon-200 bg-maroon-50 text-maroon-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="videoType"
                        value="file"
                        checked={videoType === 'file'}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="accent-maroon-800"
                      />
                      File
                    </label>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${videoType === 'url' ? 'border-maroon-200 bg-maroon-50 text-maroon-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="videoType"
                        value="url"
                        checked={videoType === 'url'}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="accent-maroon-800"
                      />
                      URL
                    </label>
                  </div>

                  {videoType === 'file' && (
                    <div>
                      <label htmlFor="videoFile" className="mb-2 block text-sm font-semibold text-gray-700">Upload Video File</label>
                      <label htmlFor="videoFile" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-maroon-300 hover:bg-maroon-50/40">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm">
                          <Upload size={18} />
                        </div>
                        <div className="min-w-0">
                          <span id="videoFileDetails" className="input-help block truncate text-sm font-semibold text-gray-700">
                            {file ? file.name : 'No file chosen'}
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">MP4, WEBM, or other video file</span>
                        </div>
                        <input
                          type="file"
                          id="videoFile"
                          required={videoType === 'file'}
                          onChange={(e) => setFile(e.target.files[0] || null)}
                          className="hidden"
                          accept="video/*"
                        />
                      </label>
                    </div>
                  )}

                  {videoType === 'url' && (
                    <div>
                      <label htmlFor="videoUrl" className="mb-2 block text-sm font-semibold text-gray-700">Video URL</label>
                      <input
                        type="url"
                        id="videoUrl"
                        required
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Paste any YouTube URL (watch, share, Shorts, or embed link)"
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Upload'}
                  </button>
                </form>
              </>
            ) : (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-maroon-50 text-maroon-800">
                    <Plus size={20} />
                  </div>
                  <div className="panel-heading">
                     <h2 className="text-xl font-bold tracking-tight text-gray-950">
                      {isNewsSection ? 'News Article' : 'Announcements'}
                    </h2>
                     <p className="text-sm text-gray-500">Create and publish public content.</p>
                  </div>
                </div>

                <form id="announcementForm" onSubmit={handlePublish} className="space-y-5">
                  <div className="space-y-4">
                    {isNewsSection && (
                      <div>
                        <label htmlFor="newsTitle" className="mb-2 block text-sm font-semibold text-gray-700">Headline</label>
                        <input 
                          type="text"
                          id="newsTitle"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Specify the publication title..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="announcementText" className="mb-2 block text-sm font-semibold text-gray-700">
                        {isNewsSection ? 'Full Publication Body' : 'Announcement Text'}
                      </label>
                      <textarea 
                        id="announcementText"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={isNewsSection ? 'Input the core message or news body here...' : 'Write announcement...'}
                        className="h-40 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maroon-600 focus:ring-4 focus:ring-maroon-100"
                      />
                    </div>

                    <div>
                      <label htmlFor="announcementImage" className="mb-2 block text-sm font-semibold text-gray-700">Upload Image</label>
                      <label htmlFor="announcementImage" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-maroon-300 hover:bg-maroon-50/40">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm">
                          <Upload size={18} />
                        </div>
                        <div className="min-w-0">
                          <span id="announcementImageDetails" className="input-help block truncate text-sm font-semibold text-gray-700">
                            {file ? file.name : 'No file chosen'}
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">PNG, JPG, or WEBP image file</span>
                        </div>
                        <input 
                          type="file"
                          id="announcementImage"
                          onChange={(e) => setFile(e.target.files[0] || null)}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-maroon-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Publish
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </article>
        </div>

        {/* Content Stream: Registry Logs */}
        <div className="space-y-6">
          {/* Announcements Log */}
          {!isNewsSection && !isVideoSection && (
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex h-10 w-10 items-center justify-center rounded-md bg-maroon-50 text-maroon-800">
                      <Megaphone size={20} />
                   </div>
                   <h2 className="text-lg font-bold tracking-tight text-gray-950">
                    Live Announcements
                  </h2>
                </div>
                <span className="text-sm font-medium text-gray-500">{announcements.length} records</span>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  [1, 2].map(i => <div key={i} className="h-28 animate-pulse bg-gray-50"></div>)
                ) : announcements.length > 0 ? (
                  announcements.map(ann => (
                    <div key={ann.id} className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                          {ann.image_url ? (
                            <img src={ann.image_url} className="h-full w-full object-cover" alt="Thumb" />
                          ) : (
                            <Megaphone className="h-full w-full p-5 text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                             <span className="h-1.5 w-1.5 rounded-full bg-maroon-700"></span>
                             <p className="text-xs font-medium text-gray-500">
                              {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                          </div>
                          <h4 className="line-clamp-2 text-base font-semibold text-gray-950">
                            {ann.title}
                          </h4>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete('announcements', ann.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-sm font-medium text-gray-500">The announcement registry is currently clear.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* News Registry Log */}
          {isNewsSection && (
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-800">
                      <Newspaper size={20} />
                   </div>
                   <h2 className="text-lg font-bold tracking-tight text-gray-950">
                    News Feed
                  </h2>
                </div>
                <span className="text-sm font-medium text-gray-500">{news.length} records</span>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  [1, 2].map(i => <div key={i} className="h-28 animate-pulse bg-gray-50"></div>)
                ) : news.length > 0 ? (
                  news.map(n => (
                    <div key={n.id} className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                          {n.image_url ? (
                            <img src={n.image_url} className="h-full w-full object-cover" alt="Thumb" />
                          ) : (
                            <Newspaper className="h-full w-full p-5 text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                             <span className="h-1.5 w-1.5 rounded-full bg-gray-700"></span>
                             <p className="text-xs font-medium text-gray-500">
                              {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                          </div>
                          <h4 className="line-clamp-2 text-base font-semibold text-gray-950">
                            {n.title}
                          </h4>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete('news', n.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-sm font-medium text-gray-500">The journalism registry is currently empty.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {isVideoSection && (
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="feed-header flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-maroon-50 text-maroon-800">
                    <PlayCircle size={20} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-gray-950">Published Videos</h3>
                </div>
                <span className="text-sm font-medium text-gray-500">{videos.length} records</span>
              </div>

              <div id="videoList" className="list divide-y divide-gray-100">
                {loading ? (
                  [1, 2].map(i => <div key={i} className="h-28 animate-pulse bg-gray-50"></div>)
                ) : videos.length > 0 ? (
                  videos.map(video => {
                    const videoSource = video.video_url || video.url || video.embed_url || video.embedUrl || '';

                    return (
                      <div key={video.id} className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-maroon-800">
                            <PlayCircle size={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-maroon-700"></span>
                              <p className="text-xs font-medium text-gray-500">
                                {video.created_at
                                  ? new Date(video.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                  : 'No date'}
                              </p>
                            </div>
                            <h4 className="line-clamp-2 text-base font-semibold text-gray-950">
                              {video.title || 'Untitled video'}
                            </h4>
                            {videoSource && (
                              <p className="mt-1 truncate text-sm text-gray-500">{videoSource}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete('featured_videos', video.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-sm font-medium text-gray-500">No published videos yet.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
