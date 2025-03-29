const db = require("../config/db");

exports.saveSched = async (req, res) => {
    const {schedule: formattedSchedule, period: counter }= req.body
    console.log("eeceived schedule is", formattedSchedule);

    let conn

    if (!Array.isArray(formattedSchedule)) {
        console.log("Invalid structure");
        return res.status(400).json({ error: "Invalid schedule data" });
    }

    try {
        conn = await db.getConnection();

        console.log("Checkpoint");

        const dayRows = await conn.query("SELECT dayid, name FROM dayofweek");
        const teacherRows = await conn.query("SELECT user_id, CONCAT(last_name, ' ', first_name) AS full_name FROM user");
        const sessionTypeRows = await conn.query("SELECT session_type_id, name FROM sessiontype");
        const promotionRows = await conn.query("SELECT promoid, name FROM promotion");
        const specialityRows = await conn.query("SELECT specialityid, name FROM speciality");

        console.log("Checkpoint");

        const dayMap = Object.fromEntries(dayRows.map(row => [row.name, row.dayid]));
        const teacherMap = Object.fromEntries(teacherRows.map(row => [row.full_name, row.user_id]));
        const sessionTypeMap = Object.fromEntries(sessionTypeRows.map(row => [row.name, row.session_type_id]));
        const promotionMap = Object.fromEntries(promotionRows.map(row => [row.name, row.promoid]));
        const specialityMap = Object.fromEntries(specialityRows.map(row => [row.name, row.specialityid]));

        // 🔹 Updated query to include `isExtra`
        const query = `INSERT INTO globaltimetableplanB (dayid, teacherid, sessiontypeid, promoid, specialityid, starttime, duration, period, isExtra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        for (const session of formattedSchedule) {
            const dayId = dayMap[session.day_of_week];
            const teacherId = teacherMap[session.teacher];
            const sessionTypeId = sessionTypeMap[session.session_type];
            const promoId = promotionMap[session.promotion];
            const specialityId = session.speciality ? specialityMap[session.speciality] : null;
            const isExtra = session.isExtra === true ? 1 : 0; // Store as 1 (true) or 0 (false)

            if (!dayId || !teacherId || !sessionTypeId || !promoId) {
                console.error("Missing mapping for:", session);
                continue;
            }

            await conn.query(query, [dayId, teacherId, sessionTypeId, promoId, specialityId, session.start_time, session.duration_minutes, counter, isExtra]);
        }

        res.json({ message: "Timetable saved!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (conn) conn.release();
    }
};
