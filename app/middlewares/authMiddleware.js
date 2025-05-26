const db = require('../config/db');
const jwt = require('jsonwebtoken');
const util = require('util');

exports.protect = async (req, res, next) => {
    try {
        let token;

        console.log('=======================================');
        console.log(req.headers);
        console.log('=======================================');
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ error: 'You are not logged in. Please log in to access this route.' });
        }

        const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const users = await db.query(
            'SELECT * FROM Account WHERE user_id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'The user belonging to this token no longer exists.' });
        }

        req.user = users[0];
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
