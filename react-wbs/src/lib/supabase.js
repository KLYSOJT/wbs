import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rblihflxnquckzmmsxis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibGloZmx4bnF1Y2t6bW1zeGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzg5MzQsImV4cCI6MjA5MDYxNDkzNH0.j6BSyakEYbcKnEZcyqplDYm95CYRd9UCRXqmZHK6Ga8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
