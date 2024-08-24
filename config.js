require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseSecret = process.env.SUPABASE_SECRET;

if (!supabaseUrl || !supabaseKey || !supabaseSecret) {
  throw new Error('Missing Supabase URL or key');
}
async function initSupabase() {
  const supabase = await createClient(supabaseUrl, supabaseKey, supabaseSecret, {
    pool: {
      maxClients: 20, // Increase the max_clients limit to 50
    },
  });
  return supabase;
}
module.exports = { supabase: initSupabase() };
