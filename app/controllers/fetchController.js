const db = require('../config/db');

exports.getTeachers = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const teachers = await conn.query(
            'SELECT first_name, last_name FROM user',
        );
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
};

exports.getTableTeachers = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const teachers = await conn.query(
            `SELECT 
                CONCAT(U.first_name,' ', U.last_name) AS full_name,
                A.email,
                U.faculty AS grade,
                U.payment_information,
                U.state
            FROM User U
            INNER JOIN Account A ON U.user_id = A.user_id`
        );
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
};



exports.getSalles = async (req, res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const teachers = await conn.query(
            'SELECT name FROM salle '
        );
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }finally {
        if (conn) conn.release();
    }
};



exports.getPromotions = async (req, res) => {
    try {
        const conn = await db.getConnection();
        const promotions = await conn.query('SELECT DISTINCT name FROM Promotion');
        res.status(200).json(promotions);
        conn.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getSections = async (req, res) => {
    const { promotion } = req.query;
    if (!promotion) return res.status(400).json({ error: 'Missing promotion parameter' });

    try {
        const conn = await db.getConnection();
        const sections = await conn.query(
            'SELECT sectionID, name FROM Section WHERE promoid = (SELECT promoid FROM Promotion WHERE name = ?)',
            [promotion]
        );
        res.status(200).json(sections);
        conn.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getGroups = async (req, res) => {
    const { section } = req.query;
    if (!section) return res.status(400).json({ error: 'Missing section parameter' });

    try {
        const conn = await db.getConnection();
        const groups = await conn.query(
            'SELECT groupID, name FROM `Group` WHERE sectionID = ?',
            [section]
        );
        res.status(200).json(groups);
        conn.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
