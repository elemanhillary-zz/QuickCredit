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
