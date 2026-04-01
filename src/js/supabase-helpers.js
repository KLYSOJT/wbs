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
