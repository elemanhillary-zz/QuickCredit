import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import secret from '../config/config';

class Auth {
  static hashPassword(password) {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  static compareHash(password, hashedPassword) {
    bcrypt.compareSync(password, hashedPassword);
  };

  static genToken(email) {
    return jwt.sign({
      user: email,
    }, secret, { expiresIn: '24h' });
  };
}

module.exports = Auth;
