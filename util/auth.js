import bcrypt from 'bcrypt';

class Auth {
  static hashPassword(password) {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  static compareHash(password, hashedPassword) {
    bcrypt.compareSync(password, hashedPassword);
  };
}

module.exports = Auth;
