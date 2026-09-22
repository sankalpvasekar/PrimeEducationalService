// lib/db.ts - Optimized and corrected DB logic
import pg, { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
});

/**
 * Executes a database query against the PostgreSQL pool.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    const res = await pool.query(text, params);
    return res.rows as T[];
  } catch (err: any) {
    console.error('❌ DB Query Error:', err.message);
    throw err;
  }
}

/**
 * Ensures the database schema is initialized.
 * Call this once when the application starts.
 */
export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT false,
      payment_done BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admins_data (
      id SERIAL PRIMARY KEY,
      hero_images JSONB DEFAULT '[]',
      company_pdfs JSONB DEFAULT '[]',
      preparation_pdfs JSONB DEFAULT '[]',
      price DECIMAL(10, 2) DEFAULT 499.00
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      payment_id VARCHAR(255),
      amount DECIMAL(10, 2),
      status VARCHAR(50) DEFAULT 'success',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const existingConfig = await query('SELECT id FROM admins_data LIMIT 1');
  if (existingConfig.length === 0) {
    await query('INSERT INTO admins_data (hero_images, company_pdfs, preparation_pdfs, price) VALUES ($1, $2, $3, $4)', 
      [JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), 499.00]);
  }
}
