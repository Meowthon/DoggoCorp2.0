const pool = require('../models/databaseModel');

const userController = {};

// INSERT INTO users (google_id, email, first_name, last_name, phone_number, is_owner)
userController.addUser = async (req, res, next) => {
  console.log('addUser request body', req.body);
  const {
    firstname,
    lastname,
    username,
    password,
    phoneNumber,
    googleId,
    email,
    watcher,
  } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (user_name, password, google_id, email, first_name, last_name, phone_number, is_owner) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ' +
        'RETURNING *',
      [
        username,
        password,
        googleId,
        email,
        firstname,
        lastname,
        phoneNumber,
        !watcher,
      ]
    );
    console.log('result at userController.addUsers: ', result.rows[0]);
    // Send the inserted dog data back to the client if needed

    res.locals.newUser = result.rows[0];
    return next();
  } catch (error) {
    return next({
      log: `Error happened at middleware userController.addUsers ${error}`,
      message: { error: 'User database profile creation error' },
    });
  }
  return next();
};

userController.getAllUsers = (req, res, next) => {
  pool
    .query('SELECT * FROM users')
    .then((data) => data.rows)
    .then((data) => (res.locals.allUsers = data))
    .then(() => next())
    .catch((err) => {
      console.log(err);
      next({
        log: 'Caught userController.getAllUsers middleware error: ' + err,
        message: { error: err.toString() },
      });
    });
};

userController.verifyUser = async (req, res, next) => {
  console.log('starting verifyUser');
  console.log(req.params);
  const { googleId } = req.params;
  console.log('Received Google ID:', googleId);
  try {
    // find the user based on the Google ID
    const user = await pool.query('SELECT * FROM users WHERE google_id = $1', [
      googleId,
    ]);
    console.log('Query Result:', user.rows);

    if (user.rows.length > 0) {
      req.locals.user = user.rows[0];
      return next();
    } else {
      // User not found, send an error response
      res.status(401).json({ error: 'User not authorized' });
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

userController.noOAuthLogIn = async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const data = await pool.query(
      'SELECT * FROM users ' + 'WHERE user_name = $1;',
      [username]
    );

    if (data.rows.length === 0)
      throw new Error('User not found', { cause: { code: 400 } });

    const user = data.rows[0];
    if (user.password !== password)
      throw new Error('Password incorrect', { cause: { code: 400 } });

    res.locals.user = user;
    return next();
  } catch (err) {
    const errMessage = 'Caught userController.noOAuthLogIn error: ' + err;
    console.log(errMessage);
    console.log(err.cause);
    return next({
      log: 'Caught userController.noOAuthLogIn error: ' + err,
      status: err.cause.code || 500,
      message: { error: err.toString() },
    });
  }
};

module.exports = userController;
