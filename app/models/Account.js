const pool = require('../config/db');

class Account {
    static async findByEmail(email) {
        return pool.query(
            'SELECT * FROM Account WHERE email = ?',
            [email]
        )
    }

    static async updatePassword(accountId, hashedPassword, salt) {
        return pool.query(
            'UPDATE Account SET password_hash = ?, salt = ? WHERE account_id = ?',
            [hashedPassword, salt, accountId]
        );
    }
}

module.exports = Account;

