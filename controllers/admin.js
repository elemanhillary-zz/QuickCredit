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

export const verifyUser = async (req, res) => {
  try {
    const { rows } = await query(`UPDATE users SET 
    status = 'verified' where email = $1 returning *`, [req.params.email]);
    if (rows.length > 0 && rows[0].status === 'verified') {
      res.status(200).json({
        status: 200,
        message: rows[0].status,
      });
    } else if (rows.length > 0 && rows[0].status === 'unverified') {
      res.status(304).json({
        status: 304,
        message: 'unverified',
      });
    } else {
      res.status(204).json({
        status: 204,
        message: 'user doesnot exist',
      });
    }
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: e.detail,
    });
  }
};

export const getLoan = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM loans where id = $1', [req.params.id]);
    if (rows.length > 0) {
      res.status(200).json({
        status: 200,
        success: true,
        data: rows[0],
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
      message: e,
    });
  }
};

export const verifyLoan = async (req, res) => {
  const { error } = validate.validateLoanStatus(req.body);
  if (error) {
    res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }

  const { status } = req.body;
  const parsedId = parseInt(req.params.id, 10);
  try {
    const { rows } = await query(`UPDATE loans SET 
    status = $1 where id = $2 returning *`, [status, parsedId]);
    if (rows.length > 0 && rows[0].status === status) {
      res.status(200).json({
        status: 200,
        message: status,
      });
    } else {
      res.json(204).json({
        status: 204,
        message: 'no content',
      });
    }
  } catch (e) {
    throw new Error(e);
  }
};
