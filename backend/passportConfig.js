const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');


function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM keremet_schema.users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          return done(err);
        }
        if (results.rows.length > 0) {
          const user = results.rows[0];
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password is incorrect' });
            }
          });
        } else {
          return done(null, false, { message: 'Email is not registered' });
        }
      }
    );
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query(
      `SELECT * FROM keremet_schema.users WHERE id = $1`,
      [id],
      (err, results) => {
        if (err) {
          return done(err);
        }
        return done(null, results.rows[0]);
      }
    );
  });
}

module.exports = initialize;
