const crypto = require('crypto');
const assert = require('node:assert/strict');
const { request } = require('../utils/emailService');
const PasswordReset = require('../models/PasswordReset');
const Account = require('../models/Account');


exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    assert.match(email, /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Invalid email format");
    console.log("✅ Email is valid in format");
    
    try {
        let account;
        try {
            account = await Account.findByEmail(email);
            console.log("🔍 Found account:", account);
        } catch (dbError) {
            console.error("❌ Database error:", dbError);
            return res.status(500).json({ message: "Database lookup failed", error: dbError.message });
        }
    
        if (!account) {
            console.log("❌ Account not found for email:", email);
            return res.status(404).json({ message: "Account not found" });
        }
    
        // ✅ Now we are sure account exists before using its properties
        const account_id = account[0].account_id;
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour
        console.log("checkpoint")
        await PasswordReset.create(account_id, token, expiresAt);
        console.log("checkpoint")

        const resetLink = `http://localhost:5173/ResetPass?token=${token}`;
        console.log("checkpoint")

        await request(email, resetLink);
    
        res.status(200).json({
            status: "success",
            message: "Password reset link sent successfully.",
        });
    } catch (error) {
        console.error("❌ Unexpected error:", error);
        return res.status(500).json({
            message: "An unexpected error occurred",
            error: error.message,
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
