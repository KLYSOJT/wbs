// Supabase Database Helper Functions for Organizational Structure

/**
 * Save or update organizational structure image to Supabase
 * @param {string} title - Department title
 * @param {string} imageData - Image data URL (PNG - lossless quality)
 * @param {string} timestamp - Updated timestamp
 */
async function saveImageToSupabase(title, imageData, timestamp) {
  try {
    // Check if image already exists
    const { data: existing, error: fetchError } = await supabaseClient
      .from('organizational_structure')
      .select('id')
      .eq('department', title)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      // Update existing record
      const { data, error } = await supabaseClient
        .from('organizational_structure')
        .update({
          image: imageData,
          mime: 'image/png',
          updated_at: timestamp
        })
        .eq('id', existing.id)
        .select();

      if (error) throw error;
      return data ? data[0] : null;
    } else {
      // Insert new record
      const { data, error } = await supabaseClient
        .from('organizational_structure')
        .insert([{
          department: title,
          image: imageData,
          mime: 'image/png',
          created_at: timestamp
        }])
        .select();

      if (error) throw error;
      return data ? data[0] : null;
    }
  } catch (error) {
    console.error('Error saving image to Supabase:', error);
    throw error;
  }
}

/**
 * Load image from Supabase
 * @param {string} title - Department title
 * @returns {Object} - Image data or null
 */
async function loadImageFromSupabase(title) {
  try {
    const { data, error } = await supabaseClient
      .from('organizational_structure')
      .select('image, updated_at')
      .eq('department', title)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error loading image from Supabase:', error);
    return null;
  }
}

/**
 * Load all organizational structure images
 * @returns {Array} - Array of organizational structure records
 */
async function loadAllImagesFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('organizational_structure')
      .select('department, image, updated_at')
      .order('department', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading all images from Supabase:', error);
    return [];
  }
}

/**
 * Announcement Supabase Functions
 */

/**
 * Save announcement to Supabase (upsert by id)
 */
async function saveAnnouncementToSupabase(data) {
  try {
    const { error } = await supabaseClient
      .from('announcement')
      .upsert({
        id: data.id,
        announcement_posts: data.text,
        image: data.image,
        timestamp: data.timestamp
      });

    if (error) throw error;
    console.log('Announcement saved to Supabase');
    return true;
  } catch (error) {
    console.error('Error saving announcement to Supabase:', error);
    throw error;
  }
}

/**
 * Load all announcements from Supabase
 */
async function loadAnnouncementsFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('announcement')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading announcements from Supabase:', error);
    return [];
  }
}

/**
 * Delete announcement from Supabase
 */
async function deleteAnnouncementFromSupabase(id) {
  try {
    const { error } = await supabaseClient
      .from('announcement')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log('Announcement deleted from Supabase');
    return true;
  } catch (error) {
    console.error('Error deleting announcement from Supabase:', error);
    throw error;
  }
}

/**
 * News Supabase Functions
 */

/**
 * Save news to Supabase (upsert by id)
 */
async function saveNewsToSupabase(data) {
  try {
    const { error } = await supabaseClient
      .from('news')
      .upsert({
        id: data.id,
        news_posts: data.text,
        image: data.image,
        timestamp: data.timestamp
      });

    if (error) throw error;
    console.log('News saved to Supabase');
    return true;
  } catch (error) {
    console.error('Error saving news to Supabase:', error);
    throw error;
  }
}

/**
 * Load all news from Supabase
 */
async function loadNewsFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('news')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading news from Supabase:', error);
    return [];
  }
}

/**
 * Delete news from Supabase
 */
async function deleteNewsFromSupabase(id) {
  try {
    const { error } = await supabaseClient
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log('News deleted from Supabase');
    return true;
  } catch (error) {
    console.error('Error deleting news from Supabase:', error);
    throw error;
  }
}

/**
 * Video Supabase Functions (Fixes ReferenceError)
 */

/**
 * Save video to Supabase (upsert by id)
 */
async function saveVideoToSupabase(data) {
  try {
    const { error } = await supabaseClient
      .from('featured_videos')
      .upsert({
        id: data.id,
        title: data.title,
        type: data.type,
        url: data.url,
        timestamp: data.timestamp
      });

    if (error) throw error;
    console.log('Video saved to Supabase');
    return true;
  } catch (error) {
    console.error('Error saving video to Supabase:', error);
    throw error;
  }
}

/**
 * Load all videos from Supabase
 */
async function loadVideosFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('featured_videos')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading videos from Supabase:', error);
    return [];
  }
}

/**
 * Delete video from Supabase
 */
async function deleteVideoFromSupabase(id) {
  try {
    const { error } = await supabaseClient
      .from('featured_videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log('Video deleted from Supabase');
    return true;
  } catch (error) {
    console.error('Error deleting video from Supabase:', error);
    throw error;
  }
}

/**
 * Delete image from Supabase
 * @param {string} title - Department title
 */
async function deleteImageFromSupabase(title) {
  try {
    const { error } = await supabaseClient
      .from('organizational_structure')
      .delete()
      .eq('department', title);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image from Supabase:', error);
    throw error;
  }
}