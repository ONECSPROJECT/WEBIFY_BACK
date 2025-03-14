const pool = require('../config/db');

class PasswordReset {
    static async create(account_id, token, expiresAt) {
        return pool.query(
            'INSERT INTO PasswordReset (account_id, token, expires_at) VALUES (?, ?, ?)',
            [account_id, token, expiresAt]
        )
    }

    static async findByToken(token) {
        const [rows] = await pool.query(
            'SELECT * FROM PasswordReset WHERE token = ? AND expires_at > NOW()',
            [token]

        )
        console.log("query result inside findByToken:", rows);

        return rows; // could have multiple records
    }

    static async deleteByAccountId(accountId) {
        return pool.query(
            'DELETE FROM PasswordReset WHERE account_id = ?',
            [accountId]
        )
    }
}



module.exports = PasswordReset;
