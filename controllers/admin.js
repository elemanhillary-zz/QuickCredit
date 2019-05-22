/* eslint-disable linebreak-style */
import { query } from '../config/config';
import validate from '../util/validation';

export const getUsers = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM users');
    if (rows.length > 0) {
      res.status(200).json({
        status: 200,
        success: true,
        data: rows,
      });
    } else {
      res.status(204).json({
        status: 204,
        success: false,
        message: 'No content',
      });
    }
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: e.detail,
    });
  }
};
