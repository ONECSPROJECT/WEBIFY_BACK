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
}



exports.getSessions = async (req, res) => {
    try {
        const conn = await db.getConnection()
        const sessions = await conn.query('SELECT DISTINCT name FROM sessiontype')
        res.status(200).json(sessions);
        conn.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}



exports.getSpeciality = async (req, res) => {
    const { promotion } = req.query;
    if (!promotion) return res.status(400).json({ error: 'Missing promotion parameter' });

    try {
        const conn = await db.getConnection();
        const specialities = await conn.query(
            'SELECT specialityid, name FROM speciality WHERE promoid = (SELECT promoid FROM Promotion WHERE name = ?)',
            [promotion]
        );
        res.status(200).json(specialities)
        conn.release()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}





exports.getSpecialityName = async (req, res) => {
    const {specialityid} = req.query;
    if (!specialityid) return res.status(400).json({ error: "Missing specialityid parameter" });

    try {
        const conn = await db.getConnection();
        const rows = await conn.query("SELECT name FROM speciality WHERE specialityid = ?", [specialityid]);
        conn.release()
        console.log("Fetched speciality:",rows[0].name)

        res.status(200).json({name: rows.length > 0 ? rows[0].name: "Null" });
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

