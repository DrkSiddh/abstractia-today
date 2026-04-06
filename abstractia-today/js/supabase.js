// ABSTRACTIA — Supabase Client
// abstractia.today → abstractia-today project

const SUPABASE_URL = 'https://xtkdnyqjheewsqnvugaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0a2RueXFqaGVld3NxbnZ1Z2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTAyODQsImV4cCI6MjA5MTA4NjI4NH0.T8X7Q1fKjpkD1csafr1F9pD5OULu1DR_eTSeVa-Rhv0';

// Load Supabase from CDN
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
supabaseScript.onload = () => {
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  document.dispatchEvent(new Event('supabase-ready'));
};
document.head.appendChild(supabaseScript);
