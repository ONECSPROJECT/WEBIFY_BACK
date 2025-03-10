const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const util = require('util');



const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.user_id, user.role); // Now includes role

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax'
  });

  const { user_id, role, email, username } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: { user_id, role, email, username } }
  });
};


exports.register = async (req, res) => {
  const { first_name, last_name, state, payment_information, faculty, email, password, role } = req.body;

  try {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const [userResult] = await db.query(
          'INSERT INTO User (first_name, last_name, state, payment_information, faculty) VALUES (?, ?, ?, ?, ?)',
          [first_name, last_name, state, payment_information, faculty]
      );
      const user_id = userResult.insertId;

      await db.query(
          'INSERT INTO Account (email, salt, password_hash, role, user_id) VALUES (?, ?, ?, ?, ?)',
          [email, salt, password_hash, role, user_id]
      );

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [accounts] = await db.query(
      'SELECT * FROM Account WHERE email = ?',
      [email]
    );

    if (accounts.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const account = accounts[0];

    const isMatch = await bcrypt.compare(password, account.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Send token on successful login
    createSendToken(account, 200, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ error: 'You are not logged in. Please log in to access this route.' });
    }

    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const [users] = await db.query(
      'SELECT * FROM Account WHERE user_id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'The user belonging to this token no longer exists.' });
    }

    req.user = users[0]; // Store user data in request object
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
};



exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action.' });
    }
    next();
  };
};


exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const { user_id } = req.user;

    const [users] = await db.query(
      'SELECT * FROM Account WHERE user_id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password in the database
    await db.query(
      'UPDATE Account SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, req.user.user_id]
    );

    // Log the user in again with a new token
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

