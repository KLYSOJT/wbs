// Supabase Configuration
const SUPABASE_URL = 'https://rblihflxnquckzmmsxis.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_prllRFR4KUB8efKQuEuvsw_Hfk8mei5';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized');
