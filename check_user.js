const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkAdmin() {
  try {
    const res = await pool.query('SELECT is_admin, name FROM users WHERE email = $1', ['primeeducationalservices515@gmail.com']);
    if (res.rows.length > 0) {
      console.log('User found:', res.rows[0]);
    } else {
      console.log('User not found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
checkAdmin();
