const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const util = require('util')
require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

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
    const { first_name, last_name, state, payment_information, grade,faculty, email, password, role,date,masked } = req.body;
    console.log("register infos:",req.body)
    let conn;
    try {
        conn = await db.getConnection();
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        console.log("password hashed")
        let full_name=`${first_name} ${last_name}`
        const userResult = await conn.query(
            'INSERT INTO User (first_name, last_name, state, payment_information, faculty, full_name, masked) VALUES (?, ?, ?, ?, ?,?,?)',
            [first_name, last_name, state, payment_information, faculty,full_name,masked]
        );
        const periodId=await conn.query(`select period_id from Periods where ?>=start_date and ?<=end_date `,[date,date])
        console.log(periodId[0].period_id)
        const teacherId=await conn.query(`select user_id from user where last_name=? and first_name=?`,[last_name,first_name])
        console.log(teacherId[0].user_id)
        const addToRankHistory=await conn.query(`insert into TeacherRankHistory(teacher_id,rank_id,start_date,end_date,period_id) values(?,?,?,?,?)`,[teacherId[0].user_id, grade,date,null,periodId[0].period_id])
        const addtoPayment=await conn.query(`insert into payment(teacher_id,suphour, suphourcourse,suphourtut,suphourlab,totalpayment,status,period_id,rank_id) values (?,?,?,?,?,?,?,?,?) `,[teacherId[0].user_id,0,0,0,0,0,0,periodId[0].period_id,grade])
        console.log("teacher added")
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
    console.log("Login request received:", req.body);

    let conn;
    try {
        conn = await db.getConnection();
        console.log("Database connection established.");

        const accounts = await conn.query(
            'SELECT * FROM Account WHERE email = ?',
            [email]
        );

        console.log("Accounts found:", accounts); // Log the retrieved accounts

        if (accounts.length === 0) {
            console.log("No account found for this email."); // Debugging log
            return res.status(400).json({ error: 'Invalid email or password type 1' });
        }

        const account = accounts[0];
        console.log("Stored hash:", account.password_hash);
        console.log("Entered password:", password);

        const isMatch = await bcrypt.compare(password, account.password_hash);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            console.log("Password does not match.");
            return res.status(400).json({ error: 'Invalid email or password type 2' });
        }

        console.log("Login successful! Creating token...");
        createSendToken(account, 200, req, res);
    } catch (error) {
        console.error("Error during login:", error);
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

