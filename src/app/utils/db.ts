import pg from 'pg';

const { Pool } = pg;


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = async (text: string, params?: string[] | number[]) => {
  const result = await pool.query(text, params);
  return result.rows;
};
