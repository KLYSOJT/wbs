// Supabase Configuration (idempotent - safe for multiple loads)
window.SUPABASE_URL ||= 'https://rblihflxnquckzmmsxis.supabase.co';
window.SUPABASE_ANON_KEY ||= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibGloZmx4bnF1Y2t6bW1zeGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzg5MzQsImV4cCI6MjA5MDYxNDkzNH0.j6BSyakEYbcKnEZcyqplDYm95CYRd9UCRXqmZHK6Ga8';

// Initialize Supabase client (idempotent)
const { createClient } = supabase;
window.supabaseClient ||= createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

// Expose to window for global access
window.supabaseClient = supabaseClient;

console.log('Supabase client initialized');
