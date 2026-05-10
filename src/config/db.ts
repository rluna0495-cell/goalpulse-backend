import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Configuraciones de estabilidad
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
  max: 10
});

export const query = (text: string, params?: any[]) => pool.query(text, params);