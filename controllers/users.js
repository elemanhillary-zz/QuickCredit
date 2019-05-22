import { query } from '../config/config';
import validate from '../util/validation';
import Auth from '../util/auth';

export const signup = async (req, res) => {
  const { error } = validate.validateSignup(req.body);
  if (error) {
    res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }

  const {
    firstname, lastname, email,
    workAddress, homeAddress, pin,
  } = req.body;
  const hashedPassword = Auth.hashPassword(pin);
  try {
    const { rows } = await query(`INSERT INTO users (firstname, lastname, email,
      workaddress, homeaddress, password) VALUES ($1, $2, $3, $4, $5, $6) returning *`,
    [firstname, lastname, email, workAddress, homeAddress, hashedPassword]);
    res.status(201).json({
      status: 201,
      Created: true,
      data: rows[0],
    });
  } catch (e) {
    if (e.detail.match('exists').length > 0) {
      res.status(409).json({
        status: 409,
        message: 'user already exist',
      });
    } else {
      res.status(400).json({
        status: 400,
        message: e.detail,
      });
    }
  }
};

export const signin = async (req, res) => {
  const { error } = validate.validateLogin(req.body);
  if (error) {
    res.status(422).json({
      status: 422,
      message: error.details[0].message,
    });
  }

  const { email, pin } = req.body;
  const token = Auth.genToken(email);
  try {
    const { rows } = await query('SELECT * FROM users where email = $1', [email]);
    const authBoolean = Auth.compareHash(pin, rows[0].password);
    if (authBoolean) {
      res.status(200).json({
        status: 200,
        Success: authBoolean,
        token,
        data: rows[0],
      });
    } else {
      res.status(401).json({
        status: 401,
        message: 'Wrong email or password',
      });
    }
  } catch (e) {
    throw new Error(e);
  }
};
