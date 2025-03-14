const pool = require('../config/db');

class PasswordReset {
    static async create(accountId, token, expiresAt) {
        return pool.query(
            'INSERT INTO PasswordReset (account_id, token, expires_at) VALUES (?, ?, ?)',
            [accountId, token, expiresAt]
        )
    }

    static async findByToken(token) {
        const [entry] = await pool.query(
            'SELECT * FROM PasswordReset WHERE token = ? AND expires_at > NOW()',
            [token]
        )
        return entry || null; // could have multiple records
    }

    static async deleteByAccountId(accountId) {
        return pool.query(
            'DELETE FROM PasswordReset WHERE account_id = ?',
            [accountId]
        )
    }
}

module.exports = PasswordReset;
