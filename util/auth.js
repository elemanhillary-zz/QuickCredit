import bcrypt from 'bcrypt';

class Auth {
  static hashPassword(password) {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };
}

module.exports = Auth;