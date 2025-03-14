const crypto = require('crypto');
const assert = require('node:assert/strict');
const { request } = require('../utils/emailService');
const PasswordReset = require('../models/PasswordReset');
const Account = require('../models/Account');
const bcrypt = require('bcrypt');


exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    assert.match(email, /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Invalid email format");

    try {
        const account = await Account.findByEmail(email);
        if (!account) {
            console.log('Account not found');
            return res.status(404).json({ message: 'Account not found' });
        }

        const account_id = account.account_id;
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await PasswordReset.create(account_id, token, expiresAt);

        const resetLink = `http://localhost:5173/<reset-front-page>?token=${token}`
        await request(email, resetLink);

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent successfully.'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Database error occurred',
            error: {
                fatal: error.fatal,
                errno: error.errno,
                sqlState: error.sqlState,
                code: error.code,
            }
        });
    }
}


exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const resetEntry = PasswordReset.findByToken(token);
        if (!resetEntry) {
            console.log('Reset entry not found!');
            return res.status(404).json({ message: 'Invalid Reset Request' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Account.updatePassword(resetEntry.account_id, hashedPassword, salt);
        await PasswordReset.deleteByAccountId(resetEntry.account_id);

    } catch (error) {
        return res.status(500).json({
            message: 'Database error occurred',
            error: {
                fatal: error.fatal,
                errno: error.errno,
                sqlState: error.sqlState,
                code: error.code,
            }
        });
    }
}
