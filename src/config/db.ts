import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en Railway
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);