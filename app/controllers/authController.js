const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const util = require('util');

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN) || '7d'
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user.user_id, user.role);

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

    let conn;
    try {
        conn = await db.getConnection();
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const userResult = await conn.query(
            'INSERT INTO User (first_name, last_name, state, payment_information, faculty) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, state, payment_information, faculty]
        );
        const user_id = userResult.insertId;

        await conn.query(
            'INSERT INTO Account (email, salt, password_hash, role, user_id) VALUES (?, ?, ?, ?, ?)',
            [email, salt, password_hash, role, user_id]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    let conn;
    try {
        conn = await db.getConnection();
        const accounts = await conn.query(
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

        createSendToken(account, 200, req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
};

exports.testProtected = async (req, res) => {
    res.status(200).json({
        "message": "Authenticated!"
    })
};

