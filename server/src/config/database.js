import pg from 'pg';
import { config } from './index.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.env === 'development') {
    console.debug('Query executed', { text: text.slice(0, 80), duration, rows: result.rowCount });
  }
  return result;
}
