import { createClient } from '@supabase/supabase-js';

// Replace with your actual project credentials
const supabaseUrl = 'https://drbqgnldmjdzkgfrfhnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYnFnbmxkbWpkemtnZnJmaG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjUzNjUsImV4cCI6MjA2Njk0MTM2NX0.UBoMbf-TBn3aG5eMSZ2l6TND6Kwx18Xb4gigJxMU0zU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
