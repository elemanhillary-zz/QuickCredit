import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
export const secret = 'qazwsxedcrfv';

export const pool = new pg.Pool({
  connectionString: process.env.development,
});
