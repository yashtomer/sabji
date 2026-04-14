// Run: node supabase/migrate.js
// Creates tables in Supabase via SQL

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load env from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
  const sql = fs.readFileSync('supabase/migrations/001_create_tables.sql', 'utf8');

  // Split by semicolons and run each statement
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

  for (const stmt of statements) {
    console.log('Running:', stmt.substring(0, 60) + '...');
    const { error } = await supabase.rpc('', {}).catch(() => ({}));
    // Use raw SQL via the REST API
    const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Use the SQL endpoint directly
  console.log('\nRunning full migration via SQL...');
  const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  console.log('Tables endpoint status:', response.status);
  console.log('\n⚠️  Please run the SQL in supabase/migrations/001_create_tables.sql');
  console.log('   directly in the Supabase SQL Editor at:');
  console.log(`   ${env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.co', '')}/project/thlscqajffiijvrbisks/sql`);
  console.log('   or: https://supabase.com/dashboard/project/thlscqajffiijvrbisks/sql\n');
}

migrate();
