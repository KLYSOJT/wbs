// Supabase Configuration
const SUPABASE_URL = 'https://rblihflxnquckzmmsxis.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibGloZmx4bnF1Y2t6bW1zeGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzg5MzQsImV4cCI6MjA5MDYxNDkzNH0.j6BSyakEYbcKnEZcyqplDYm95CYRd9UCRXqmZHK6Ga8';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized');
