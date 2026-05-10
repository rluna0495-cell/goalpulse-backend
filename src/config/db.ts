import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, // 10 segundos máximo para conectar
});

export const query = (text: string, params?: any[]) => pool.query(text, params);