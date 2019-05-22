/* eslint-disable linebreak-style */
/* eslint-disable import/prefer-default-export */
import { query } from '../config/config';
import validate from '../util/validation';

export const loanApply = async (req, res) => {
  const { error } = validate.validateLoan(req.body);
  if (error) {
    res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }

  let rows;
  const { loanType, tenor, amount } = req.body;
  const parsedAmount = parseFloat(amount, 10);
  const parsedTenor = parseInt(tenor, 10);
  const interest = parseFloat((parsedAmount * parsedTenor * 5) / 100, 10);
  const paymentInstallment = Math.floor(parseFloat((parsedAmount + interest)
  / parseInt(parsedTenor, 10), 10));
  const balance = parseFloat((parsedAmount + interest), 10);
  const email = req.decoded.user.toString().trim();
  try {
    rows = await query('SELECT * FROM loans where email = $1 AND repaid = false',
      [req.decoded.user.toString().trim()]);
    if (rows.rows.length > 0) {
      res.status(403).json({
        status: 403,
        message: 'you have unpaid loan',
      });
    } else {
      rows = await query(`INSERT INTO loans (email, loanType, tenor, amount,
        interest, paymentInstallment, balance) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *`,
      [email, loanType, parsedTenor, parsedAmount, interest, paymentInstallment, balance]);
      res.status(201).json({
        status: 201,
        Success: true,
        data: rows.rows[0],
      });
    }
  } catch (e) {
    throw Error(e);
  }
};

export const getALL = async (req, res) => {
  const { status, repaid } = req.query;
  let rows;
  if (Object.keys(req.query).length !== 0 && req.method === 'GET') {
    const repaidTrim = repaid.trim();
    let repaidBool;
    if (repaidTrim === 'true') {
      repaidBool = true;
    } else if (repaidTrim === 'false') {
      repaidBool = false;
    }
    try {
      rows = await query('SELECT * FROM loans where status = $1 AND repaid = $2',
        [status, repaidBool]);
      if (rows.rows.length > 0) {
        res.status(200).json({
          status: 200,
          success: true,
          data: rows.rows,
        });
      } else {
        res.status(204).json({
          status: 204,
          message: 'no content',
        });
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  try {
    rows = await query('SELECT * FROM loans');
    if (rows.rows.length > 0) {
      res.status(200).json({
        status: 200,
        success: true,
        data: rows.rows,
      });
    } else {
      res.status(204).json({
        status: 204,
        message: 'no content',
      });
    }
  } catch (e) {
    throw new Error(e);
  }
};
export const repay = async (req, res) => {
  let rows;
  const { error } = validate.validateAmount(req.body);
  if (error) {
    res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }
  const { amount } = req.body;
  const parsedAmount = parseFloat(amount, 10);
  try {
    rows = await query('SELECT * FROM loans where id = $1 AND repaid = false AND (status = \'pending\' OR status = \'rejected\')', [parseInt(req.params.id, 10)]);
    if (rows.rows.length > 0) {
      const loanId = parseInt(req.params.id, 10);
      const { loantype } = rows.rows[0];
      const balanceAmount = rows.rows[0].balance;
      const mi = parseFloat(rows.rows[0].paymentinstallment);
      const loanedAmount = parseFloat(rows.rows[0].amount);
      const balance = parseFloat(balanceAmount - parsedAmount);
      const row = await query(`INSERT INTO repayments (loantype, loanId, amount,
          monthlyInstallment, paidAmount, balance) VALUES ($1, $2, $3, $4, $5, $6) returning *`,
      [loantype, loanId, loanedAmount, mi, parsedAmount, balance]);
      await query('UPDATE loans SET balance = $1', [balance]);
      if (balance <= 0) {
        await query('UPDATE loans SET repaid = true');
      }
      res.status(201).json({
        status: 201,
        created: true,
        data: row.rows[0],
      });
    } else {
      res.status(403).json({
        status: 403,
        message: 'you don\'t have recurring loan',
      });
    }
  } catch (e) {
    throw Error(e);
  }
};
