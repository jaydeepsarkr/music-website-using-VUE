import { createClient } from '@supabase/supabase-js';

// Directly define the Supabase URL and Key
const supabaseUrl = 'https://iiruzycxcqiwnsbocoli.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcnV6eWN4Y3Fpd25zYm9jb2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MDEzODEsImV4cCI6MjA1NDA3NzM4MX0.AqwMklQFyrqEZ70SCX1frPyoHZGtq_ai5LaN3L1cZVU';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Default export
export default supabase;
