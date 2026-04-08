// ==================== INDEXEDDB SETUP FOR DIVISION MEMORANDUM ====================
const DB_NAME = 'WBSSDatabase_DivisionMemo';
const DB_VERSION = 2;
const STORE_NAME = 'divisionMemo';
const FILE_STORE_NAME = 'divisionMemoFiles';

let db = null;

function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      db = request.result;
      console.log('✓ IndexedDB initialized:', DB_NAME);
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      console.log('IndexedDB upgrade needed, version:', event.oldVersion, '->', event.newVersion);
      
      // Create division memorandum store
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        console.log('✓ Created object store:', STORE_NAME);
      }
      
      // Create file store for PDF blobs
      if (!database.objectStoreNames.contains(FILE_STORE_NAME)) {
        database.createObjectStore(FILE_STORE_NAME, { keyPath: 'id' });
        console.log('✓ Created object store:', FILE_STORE_NAME);
      }
    };
  });
}

// Get all items from store
async function getAllFromStore(storeName) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    try {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const items = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(items);
      };
    } catch (error) {
      reject(error);
    }
  });
}

// Add item to store
async function addToStore(storeName, item) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    try {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    } catch (error) {
      reject(error);
    }
  });
}

// Update item in store
async function updateInStore(storeName, item) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    try {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    } catch (error) {
      reject(error);
    }
  });
}

// Delete item from store
async function deleteFromStore(storeName, id) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    try {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Store PDF file in IndexedDB (fallback)
async function storePdfInIndexedDB(file, memoId) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    try {
      // Convert File to Blob if needed and ensure proper storage
      const blobToStore = file instanceof Blob ? file : new Blob([file], { type: 'application/pdf' });
      
      const transaction = db.transaction([FILE_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(FILE_STORE_NAME);
      const request = store.put({
        id: memoId,
        fileName: file.name || 'document.pdf',
        blob: blobToStore,
        timestamp: Date.now()
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    } catch (error) {
      reject(error);
    }
  });
}

// Retrieve PDF file from IndexedDB
async function getPdfFromIndexedDB(memoId) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    try {
      const transaction = db.transaction([FILE_STORE_NAME], 'readonly');
      const store = transaction.objectStore(FILE_STORE_NAME);
      const request = store.get(memoId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    } catch (error) {
      reject(error);
    }
  });
}

// Delete PDF from IndexedDB
async function deletePdfFromIndexedDB(memoId) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    try {
      const transaction = db.transaction([FILE_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(FILE_STORE_NAME);
      const request = store.delete(memoId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// ==================== SUPABASE STORAGE & HELPER FUNCTIONS ====================
const DIVISION_MEMO_BUCKET = 'divsion-memo-files';

/**
 * Upload PDF file to Supabase Storage when available, otherwise fall back to IndexedDB
 */
function getStorageFilePath(file, memoId) {
  const safeName = (file?.name || 'document.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `division-memo/${memoId}-${Date.now()}-${safeName}`;
}

async function uploadPdfToStorage(file, memoId) {
  try {
    if (!file) return null;

    // Validate file is PDF
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      throw new Error('Only PDF files are allowed');
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 10MB');
    }

    if (window.supabaseClient?.storage) {
      try {
        const filePath = getStorageFilePath(file, memoId);
        console.log('Uploading PDF to Supabase Storage...');

        const { error: uploadError } = await window.supabaseClient.storage
          .from(DIVISION_MEMO_BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'application/pdf'
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = window.supabaseClient.storage
          .from(DIVISION_MEMO_BUCKET)
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          console.log('PDF uploaded to Supabase Storage');
          return publicUrlData.publicUrl;
        }
      } catch (storageError) {
        console.warn('Supabase Storage upload failed, falling back to IndexedDB:', storageError.message);
      }
    }

    console.log('Storing PDF in IndexedDB fallback...');
    await storePdfInIndexedDB(file, memoId);
    console.log('PDF stored in IndexedDB');
    return `idb://${memoId}`;
  } catch (error) {
    console.error('Error uploading PDF:', error.message);
    throw error;
  }
}

/**
 * Delete PDF file from IndexedDB or Supabase Storage
 */
async function deletePdfFromStorage(fileUrl, memoId) {
  try {
    if (!fileUrl) return true;

    // Handle IndexedDB files
    if (fileUrl.startsWith('idb://')) {
      await deletePdfFromIndexedDB(memoId);
      console.log('✓ PDF deleted from IndexedDB');
      return true;
    }

    // Handle Supabase Storage files (if they exist)
    if (fileUrl.startsWith('http')) {
      try {
        // Extract file path from URL
        const urlParts = fileUrl.split(`/${DIVISION_MEMO_BUCKET}/`);
        if (urlParts.length === 2) {
          const filePath = urlParts[1].split('?')[0];
          const { error } = await supabaseClient.storage
            .from(DIVISION_MEMO_BUCKET)
            .remove([filePath]);

          if (!error) {
            console.log('✓ PDF deleted from Supabase Storage');
          }
        }
      } catch (storageError) {
        console.warn('⚠️ Could not delete from Supabase Storage:', storageError.message);
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting PDF:', error.message);
    return false;
  }
}

/**
 * Save or update Division Memorandum to Supabase (with file)
 */
async function saveMemoToSupabase(data) {
  try {
    // Validate required fields
    if (!data.title || !data.date) {
      throw new Error('Title and date are required');
    }

    if (!data.file) {
      throw new Error('PDF file is required');
    }

    console.log('Saving Division Memorandum:', data.title);

    let result;
    let error;

    if (data.id) {
      // UPDATE existing record
      console.log('Updating record with id:', data.id);
      const { data: updateData, error: updateError } = await supabaseClient
        .from('division_memorandum')
        .update({
          title: data.title,
          date: data.date,
          description: data.description || null,
          file: data.file
        })
        .eq('id', data.id)
        .select();

      result = updateData;
      error = updateError;
    } else {
      // INSERT new record (omit id, let database generate it)
      console.log('Inserting new record');
      const { data: insertData, error: insertError } = await supabaseClient
        .from('division_memorandum')
        .insert({
          title: data.title,
          date: data.date,
          description: data.description || null,
          file: data.file
        })
        .select();

      result = insertData;
      error = insertError;
    }

    if (error) {
      // Handle specific error codes
      if (error.code === '42501') {
        console.warn('⚠️ RLS policy violation - offline mode enabled');
      } else if (error.code === '401' || error.status === 401) {
        console.warn('⚠️ Unauthorized - check Supabase configuration');
      }
      throw error;
    }

    console.log('✓ Division Memorandum saved to Supabase:', data.title);
    return result ? result[0] : data;
  } catch (error) {
    console.error('Error saving Division Memorandum to Supabase:', error.message);
    throw error;
  }
}

/**
 * Load all Division Memorandums from Supabase
 */
async function loadMemosFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('division_memorandum')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('⚠️ Could not load from Supabase:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error loading Division Memorandums from Supabase:', error.message);
    return [];
  }
}

async function migrateMemoFileToPublicUrl(memo) {
  if (!memo?.id || !memo.file || !memo.file.startsWith('idb://')) {
    return memo;
  }

  try {
    const fileData = await getPdfFromIndexedDB(memo.id);
    if (!fileData?.blob) {
      return memo;
    }

    const uploadSource = new File(
      [fileData.blob],
      fileData.fileName || `division-memo-${memo.id}.pdf`,
      { type: fileData.blob.type || 'application/pdf' }
    );

    const publicUrl = await uploadPdfToStorage(uploadSource, memo.id);
    if (!publicUrl || publicUrl.startsWith('idb://')) {
      return memo;
    }

    const { data, error } = await supabaseClient
      .from('division_memorandum')
      .update({ file: publicUrl })
      .eq('id', memo.id)
      .select()
      .single();

    if (error) {
      console.warn('Could not update migrated file URL in Supabase:', error.message);
      return memo;
    }

    const migratedMemo = data || { ...memo, file: publicUrl };

    try {
      await updateInStore(STORE_NAME, migratedMemo);
    } catch (storeError) {
      console.log('Local store update skipped after migration');
    }

    console.log('Migrated Division Memorandum file to public URL:', memo.id);
    return migratedMemo;
  } catch (error) {
    console.warn(`Skipping migration for memo ${memo.id}:`, error.message);
    return memo;
  }
}

async function migrateMemosToPublicUrls(memos) {
  const migratedMemos = [];

  for (const memo of memos) {
    migratedMemos.push(await migrateMemoFileToPublicUrl(memo));
  }

  return migratedMemos;
}

/**
 * Delete Division Memorandum from Supabase
 */
async function deleteMemoFromSupabase(id, fileUrl) {
  try {
    // Delete file from storage first
    if (fileUrl) {
      await deletePdfFromStorage(fileUrl, id);
    }

    const { error } = await supabaseClient
      .from('division_memorandum')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log('✓ Division Memorandum deleted from Supabase');
    return true;
  } catch (error) {
    console.error('Error deleting Division Memorandum from Supabase:', error.message);
    return false;
  }
}

// ==================== UTILITY FUNCTIONS ====================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
}

// Generate unique ID
function generateId() {
  return Math.floor(Math.random() * 1000000000);
}

/**
 * View PDF file from IndexedDB in a new tab
 */
async function downloadIdbFile(memoId, memoTitle) {
  try {
    console.log('Fetching file with ID:', memoId);
    const fileData = await getPdfFromIndexedDB(memoId);
    
    if (!fileData) {
      console.error('File data not found for ID:', memoId);
      alert('File not found');
      return;
    }
    
    if (!fileData.blob) {
      console.error('Blob is missing in file data:', fileData);
      alert('File data is corrupted');
      return;
    }

    // Create blob URL for viewing
    const blobUrl = URL.createObjectURL(fileData.blob);
    console.log('Blob URL created:', blobUrl);
    
    // Open PDF in a new tab (browser will use native viewer or PDF.js)
    const newWindow = window.open(blobUrl, '_blank');
    
    if (!newWindow) {
      alert('Please allow pop-ups to view the PDF');
      URL.revokeObjectURL(blobUrl);
      return;
    }
    
    // Clean up blob URL after a delay (keep it while PDF loads)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  } catch (error) {
    console.error('Error viewing file:', error);
    alert('Error viewing file: ' + error.message);
  }
}

// ==================== DOM MANAGEMENT ====================

let allMemos = [];
let editingId = null;
let deletingId = null;

// ==================== MODAL FUNCTIONS ====================

function openEditModal(id) {
  const memo = allMemos.find(m => m.id === id);
  if (!memo) return;

  editingId = id;
  
  const modal = document.querySelector('#editModal');
  document.querySelector('#editTitle').value = memo.title;
  document.querySelector('#editDate').value = memo.date;
  document.querySelector('#editDescription').value = memo.description || '';
  document.querySelector('#editFileName').textContent = 'No file chosen';
  document.querySelector('#editDocFile').value = '';
  
  modal.classList.add('active');
}

function closeEditModal() {
  const modal = document.querySelector('#editModal');
  modal.classList.remove('active');
  editingId = null;
}

function openDeleteModal(id) {
  const memo = allMemos.find(m => m.id === id);
  if (!memo) return;

  deletingId = id;
  const modal = document.querySelector('#deleteModal');
  const deleteMessage = document.querySelector('#deleteMessage');
  deleteMessage.textContent = `Are you sure you want to delete "${memo.title}"? This action cannot be undone.`;
  
  modal.classList.add('active');
}

function closeDeleteModal() {
  const modal = document.querySelector('#deleteModal');
  modal.classList.remove('active');
  deletingId = null;
}

function ensureDeleteSuccessModal() {
  if (document.querySelector('#deleteSuccessModal')) return;

  const modal = document.createElement('div');
  modal.id = 'deleteSuccessModal';
  modal.className = 'modal';
  modal.innerHTML = [
    '<div class="modal-content modal-confirmation modal-success">',
      '<div class="modal-header">',
        '<h2>Deleted Successfully</h2>',
        '<button class="modal-close" onclick="closeDeleteSuccessModal()">&times;</button>',
      '</div>',
      '<div class="modal-body">',
        '<div class="success-icon" aria-hidden="true">',
          '<i class="fas fa-circle-check"></i>',
        '</div>',
        '<p id="deleteSuccessMessage">Document deleted successfully.</p>',
      '</div>',
      '<div class="modal-footer">',
        '<button class="btn-save" onclick="closeDeleteSuccessModal()">OK</button>',
      '</div>',
    '</div>'
  ].join('');

  document.body.appendChild(modal);
}

function openDeleteSuccessModal(message = 'Document deleted successfully.') {
  const modal = document.querySelector('#deleteSuccessModal');
  const successMessage = document.querySelector('#deleteSuccessMessage');
  if (!modal || !successMessage) return;

  successMessage.textContent = message;
  modal.classList.add('active');
}

function closeDeleteSuccessModal() {
  const modal = document.querySelector('#deleteSuccessModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

async function submitEditForm() {
  const title = document.querySelector('#editTitle').value.trim();
  const date = document.querySelector('#editDate').value;
  const description = document.querySelector('#editDescription').value.trim();
  const fileInput = document.querySelector('#editDocFile');

  if (!title || !date) {
    alert('Please fill in title and date');
    return;
  }

  try {
    const memo = allMemos.find(m => m.id === editingId);
    if (!memo) return;

    let fileUrl = memo.file;

    // If a new file was selected, upload it
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      // Validate file is PDF
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Only PDF files are allowed');
        return;
      }

      // Validate file size (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert('File size must be less than 10MB');
        return;
      }

      // Delete old file if it exists
      if (memo.file) {
        await deletePdfFromStorage(memo.file, editingId);
      }

      // Upload new file
      fileUrl = await uploadPdfToStorage(file, editingId);
    }

    const updatedMemo = {
      id: editingId,
      title,
      date,
      description,
      file: fileUrl
    };

    // Update in Supabase
    await saveMemoToSupabase(updatedMemo);

    // Update in IndexedDB
    await updateInStore(STORE_NAME, updatedMemo);

    // Reload table
    await loadMemos();
    closeEditModal();
    alert('Document updated successfully!');
  } catch (error) {
    console.error('Error updating memo:', error);
    alert('Error: ' + error.message);
  }
}

async function confirmDelete() {
  if (!deletingId) return;

  try {
    const memo = allMemos.find(m => m.id === deletingId);
    
    // Delete from Supabase
    await deleteMemoFromSupabase(deletingId, memo?.file);
    
    // Delete from IndexedDB
    await deleteFromStore(STORE_NAME, deletingId);
    
    // Reload memos
    await loadMemos();
    closeDeleteModal();
    openDeleteSuccessModal('Document deleted successfully.');
  } catch (error) {
    console.error('Error deleting memo:', error);
    alert('Error deleting document');
  }
}

async function loadMemos() {
  try {
    // Try loading from Supabase first
    const supabaseMemos = await loadMemosFromSupabase();
    const normalizedMemos = await migrateMemosToPublicUrls(supabaseMemos);
    
    if (normalizedMemos.length > 0) {
      allMemos = normalizedMemos;
      // Sync to local storage
      for (const memo of normalizedMemos) {
        try {
          await updateInStore(STORE_NAME, memo);
        } catch (e) {
          // If update fails, try adding
          try {
            await addToStore(STORE_NAME, memo);
          } catch (e2) {
            console.log('Item already exists or sync error');
          }
        }
      }
    } else {
      // Fall back to IndexedDB if Supabase fails
      allMemos = await getAllFromStore(STORE_NAME);
    }
    
    renderTable(allMemos);
  } catch (error) {
    console.error('Error loading memos:', error);
    allMemos = [];
    renderTable([]);
  }
}

function renderTable(memos) {
  const tbody = document.querySelector('.resources-table tbody');
  
  if (!tbody) return;

  if (memos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No documents found</td></tr>';
    return;
  }

  tbody.innerHTML = memos.map(memo => {
    let fileDisplay = 'N/A';
    if (memo.file) {
      if (memo.file.startsWith('idb://')) {
        // IndexedDB file - create view button
        const escapedTitle = escapeHtml(memo.title);
        fileDisplay = `<button class="btn-view" onclick="downloadIdbFile(${memo.id}, '${escapedTitle}')">View</button>`;
      } else {
        // Supabase Storage or external URL
        fileDisplay = `<a href="${escapeHtml(memo.file)}" target="_blank">View</a>`;
      }
    }

    return `
      <tr data-id="${memo.id}">
        <td>${escapeHtml(formatDate(memo.date))}</td>
        <td>${escapeHtml(memo.title)}</td>
        <td>${escapeHtml(memo.description || 'N/A')}</td>
        <td>${fileDisplay}</td>
        <td>
          <button class="btn-edit" onclick="editMemo(${memo.id})">Edit</button>
          <button class="btn-delete" onclick="deleteMemo(${memo.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function searchMemos(query) {
  const filtered = allMemos.filter(memo => 
    memo.title.toLowerCase().includes(query.toLowerCase()) ||
    (memo.description && memo.description.toLowerCase().includes(query.toLowerCase()))
  );
  renderTable(filtered);
}

function editMemo(id) {
  openEditModal(id);
}

async function deleteMemo(id) {
  openDeleteModal(id);
}

function resetForm() {
  const form = document.querySelector('#uploadForm');
  form.reset();
  editingId = null;
  document.querySelector('.file-name').textContent = 'No file chosen';
  const submitBtn = form.querySelector('.upload-btn');
  submitBtn.textContent = 'Upload';
}

// ==================== FILE HANDLING ====================

document.addEventListener('DOMContentLoaded', async function() {
  ensureDeleteSuccessModal();
  // Initialize IndexedDB
  try {
    await initIndexedDB();
    await loadMemos();
  } catch (error) {
    console.error('IndexedDB initialization error:', error);
  }

  // Form submission
  const uploadForm = document.querySelector('#uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const title = document.querySelector('#memoTitle').value.trim();
      const date = document.querySelector('#memoDate').value;
      const description = document.querySelector('#memoDescription').value.trim();
      const fileInput = document.querySelector('#docFile');

      if (!title || !date) {
        alert('Please fill in title and date');
        return;
      }

      if (fileInput.files.length === 0) {
        alert('Please select a PDF file');
        return;
      }

      // Validate file is PDF
      const file = fileInput.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Only PDF files are allowed');
        fileInput.value = '';
        document.querySelector('.file-name').textContent = 'No file chosen';
        return;
      }

      // Validate file size (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert('File size must be less than 10MB');
        return;
      }

      try {
        // Upload PDF to storage (use editingId if updating, or temporary id for temp storage)
        console.log('Uploading PDF file...');
        const tempId = editingId || `temp_${Date.now()}`;
        const fileUrl = await uploadPdfToStorage(file, tempId);

        const memoData = {
          title,
          date,
          description,
          file: fileUrl
        };

        // Add id only if updating (editingId exists)
        if (editingId) {
          memoData.id = editingId;
        }

        // Save to Supabase
        console.log('Saving to database...');
        const savedMemo = await saveMemoToSupabase(memoData);

        // If new memo (not editing), update file ID to match the saved memo's ID
        if (!editingId && savedMemo && savedMemo.id && fileUrl.startsWith('idb://')) {
          const fileData = await getPdfFromIndexedDB(tempId);
          if (fileData) {
            // Store the file with the correct memo ID
            await storePdfInIndexedDB(fileData.blob, savedMemo.id);
            // Delete the temp file
            await deletePdfFromIndexedDB(tempId);
            
            // Update the saved memo's file reference to use the correct ID
            const correctedFileUrl = `idb://${savedMemo.id}`;
            const updatedMemo = { ...savedMemo, file: correctedFileUrl };
            
            // Update in Supabase with correct file reference
            const { error } = await supabaseClient
              .from('division_memorandum')
              .update({ file: correctedFileUrl })
              .eq('id', savedMemo.id);
            
            if (!error) {
              console.log('✓ File remapped to memo ID:', savedMemo.id);
            } else {
              console.warn('Could not update file reference in Supabase:', error);
            }
          }
        }

        // Save to IndexedDB (with returned id from database)
        if (editingId) {
          await updateInStore(STORE_NAME, savedMemo);
        } else {
          await addToStore(STORE_NAME, savedMemo);
        }

        // Reload table
        await loadMemos();
        resetForm();
        alert('Document saved successfully!');
      } catch (error) {
        console.error('Error saving memo:', error);
        alert('Error: ' + error.message);
      }
    });
  }

  // File input label update with validation
  const fileInput = document.querySelector('#docFile');
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (this.files.length === 0) {
        document.querySelector('.file-name').textContent = 'No file chosen';
        return;
      }

      const file = this.files[0];
      
      // Validate file type
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Only PDF files are allowed');
        this.value = '';
        document.querySelector('.file-name').textContent = 'No file chosen';
        return;
      }

      // Validate file size
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert('File size must be less than 10MB');
        this.value = '';
        document.querySelector('.file-name').textContent = 'No file chosen';
        return;
      }

      document.querySelector('.file-name').textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
    });
  }

  // Edit modal file input listener
  const editFileInput = document.querySelector('#editDocFile');
  if (editFileInput) {
    editFileInput.addEventListener('change', function() {
      if (this.files.length === 0) {
        document.querySelector('#editFileName').textContent = 'No file chosen';
        return;
      }

      const file = this.files[0];
      
      // Validate file type
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        alert('Only PDF files are allowed');
        this.value = '';
        document.querySelector('#editFileName').textContent = 'No file chosen';
        return;
      }

      // Validate file size
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert('File size must be less than 10MB');
        this.value = '';
        document.querySelector('#editFileName').textContent = 'No file chosen';
        return;
      }

      document.querySelector('#editFileName').textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
    });
  }

  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    const editModal = document.querySelector('#editModal');
    const deleteModal = document.querySelector('#deleteModal');
    const successModal = document.querySelector('#deleteSuccessModal');
    
    if (event.target === editModal) {
      closeEditModal();
    }
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
    if (event.target === successModal) {
      closeDeleteSuccessModal();
    }
  });

  // Close modals with Escape key
  window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeEditModal();
      closeDeleteModal();
      closeDeleteSuccessModal();
    }
  });

  // Search functionality
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.addEventListener('input', function(e) {
      searchMemos(e.target.value);
    });
  }

  // Auto-load data every 30 seconds to sync from Supabase
  setInterval(async () => {
    try {
      const supabaseMemos = await loadMemosFromSupabase();
      const normalizedMemos = await migrateMemosToPublicUrls(supabaseMemos);
      if (normalizedMemos.length > 0 && JSON.stringify(normalizedMemos) !== JSON.stringify(allMemos)) {
        allMemos = normalizedMemos;
        renderTable(allMemos);
        console.log('✓ Synced from Supabase');
      }
    } catch (error) {
      console.log('Sync check skipped (offline or error)');
    }
  }, 30000);
});


