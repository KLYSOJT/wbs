/**
 * Converts video share URLs to their embeddable equivalents.
 *
 * YouTube — any variant → https://www.youtube.com/embed/VIDEO_ID
 *   ✓ youtube.com/watch?v=ID
 *   ✓ m.youtube.com/watch?v=ID   (mobile)
 *   ✓ youtu.be/ID               (short link)
 *   ✓ youtube.com/shorts/ID     (Shorts)
 *   ✓ youtube.com/embed/ID      (already correct, pass-through)
 *
 * Google Drive — share/view link → /preview link
 *   ✓ drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   ✓ drive.google.com/file/d/FILE_ID/view
 *   ✓ drive.google.com/open?id=FILE_ID
 *   ✓ drive.google.com/file/d/FILE_ID/preview  (already correct)
 *   ⚠ File must still be shared as "Anyone with the link" in Google Drive
 *
 * All other URLs (direct .mp4, etc.) are returned unchanged.
 *
 * @param {string} url - Raw URL from the admin input or database
 * @returns {string} - Embed-safe URL for use in an iframe src
 */
export function toEmbedUrl(url) {
  if (!url || typeof url !== 'string') return url;

  const trimmed = url.trim();

  // ── YouTube ────────────────────────────────────────────────────────
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    // Already an embed URL — pass through
    if (trimmed.includes('youtube.com/embed/')) return trimmed;

    const match = trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // ── Google Drive ───────────────────────────────────────────────────
  if (trimmed.includes('drive.google.com')) {
    // Already a preview URL — pass through
    if (trimmed.includes('/preview')) return trimmed;

    // drive.google.com/file/d/FILE_ID/view  (or any suffix)
    const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
    if (fileMatch) {
      return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }

    // drive.google.com/open?id=FILE_ID
    const openMatch = trimmed.match(/[?&]id=([^&]+)/);
    if (openMatch) {
      return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
    }
  }

  // ── Everything else (direct .mp4, .webm, etc.) ────────────────────
  return trimmed;
}
