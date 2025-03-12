const pool = require('../config/db');

class PasswordReset {
    static async create(accountId, token, expiresAt) {
        return pool.query(
            'INSERT INTO PasswordReset (account_id, token, expires_at) VALUES (?, ?, ?)',
            [accountId, token, expiresAt]
        )
    }

    static async findByToken(token) {
        const [rows] = await pool.query(
            'SELECT * FROM PasswordReset WHERE token = ? AND expires_at > NOW()',
            [token]
        )
        return rows[0] || null; // could have multiple records
    }

    static async deleteByUserId(accountId) {
        return pool.query(
            'DELETE FROM PasswordReset WHERE account_id = ?',
            [accountId]
        )
    }
}

module.exports = PasswordReset;
