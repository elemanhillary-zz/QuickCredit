/* eslint-disable no-constant-condition */
/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
let connectionString;

if (process.env.NODE_ENV || 'development') {
  connectionString = process.env.development;
}
if (process.env.NODE_ENV || 'test') {
  connectionString = process.env.test;
}

export const pool = new pg.Pool({
  connectionString,
});

export const query = async (...args) => {
  const client = await pool.connect();
  let res;
  try {
    await client.query('BEGIN');
    try {
      res = await client.query(...args);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
};
