import pg, { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// 🛡️ Robust Environment Loader for maintenance scripts
if (!process.env.DATABASE_URL) {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) process.env[key] = value;
      }
    });
  }
}

const connectionString = process.env.DATABASE_URL;
if (connectionString) {
  const masked = connectionString.replace(/:[^:@]+@/, ':****@');
  console.log(`📡 Connecting to DB: ${masked}`);
}

const globalForDb = global as unknown as { pool: Pool };

export const pool =
  globalForDb.pool ||
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

/**
 * Executes a database query against the PostgreSQL pool.
 * @param text - The SQL query string.
 * @param params - Optional parameters for the query.
 * @returns A promise that resolves to the query result rows.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_DB) console.log('executed query', { text, duration, rows: res.rowCount });
    return res.rows as T[];
  } catch (err: any) {
    console.error('❌ DB Query Error:', err.message);
    if (err.message.includes('SSL')) {
      console.log('💡 TIP: Try adding "?sslmode=require" to your DATABASE_URL in .env.local if not present.');
    }
    throw err;
  }
}

/**
 * Initializes the database schema.
 * Drops existing tables and recreates them with the current schema.
 * Seeds default data for admin configurations.
 */
export async function initDB() {
  await query(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT false,
      payment_done BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    DROP TABLE IF EXISTS admins_data;
    CREATE TABLE IF NOT EXISTS admins_data (
      id SERIAL PRIMARY KEY,
      hero_images JSONB DEFAULT '[]',
      company_pdfs JSONB DEFAULT '[]',
      preparation_pdfs JSONB DEFAULT '[]',
      price DECIMAL(10, 2) DEFAULT 499.00
    );
  `);

  await query('INSERT INTO admins_data (hero_images, company_pdfs, preparation_pdfs, price) VALUES ($1, $2, $3, $4)', 
      [JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), 499.00]);

  // 🛡️ Auto-sync Superuser from .env.local
  await syncAdminUser();
}

/**
 * Synchronizes the superuser account from environment variables.
 * Creates or updates the admin user in the database.
 */
export async function syncAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env.local. Skipping superuser sync.');
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    await query(`
      INSERT INTO users (name, email, password_hash, is_admin, payment_done)
      VALUES ('Super Admin', $1, $2, true, false)
      ON CONFLICT (email) DO UPDATE SET 
        is_admin = true, 
        password_hash = EXCLUDED.password_hash;
    `, [adminEmail, hash]);

    console.log(`✅ Superuser synchronized: ${adminEmail}`);
  } catch (err: any) {
    console.error('❌ Superuser sync failed:', err.message);
  }
}
