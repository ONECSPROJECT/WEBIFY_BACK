const db = require("../config/db")





exports.saveSched= async (req, res) =>{
    const {schedule: formattedSchedule,  period: counter} = req.body;
    let conn

    if (!Array.isArray(formattedSchedule)){
        console.log("invalid structure")
        return res.status(400).json({ error:"Invalid schedule data"})
    }

    try {
        conn = await db.getConnection()
        
        console.log("checkpoint")





        const dayRows = await conn.query("select dayid, name from dayofweek")
        const teacherRows = await conn.query("select user_id, CONCAT(last_name,' ', first_name) as full_name from user");
        const sessionTypeRows = await conn.query("select session_type_id, name from sessiontype")
        const promotionRows = await conn.query("select promoid, name from promotion")
        const specialityRows = await conn.query("select specialityid, name from speciality")
        console.log("checkpoint")

        const dayMap= Object.fromEntries(dayRows.map(row => [row.name, row.dayid]));
        const teacherMap = Object.fromEntries(teacherRows.map(row => [row.full_name, row.user_id]))
        const sessionTypeMap = Object.fromEntries(sessionTypeRows.map(row => [row.name, row.session_type_id]))
        const promotionMap =Object.fromEntries(promotionRows.map(row => [row.name, row.promoid]))
        const specialityMap= Object.fromEntries(specialityRows.map(row => [row.name, row.specialityid]))

        const query= `INSERT INTO globaltimetableplanB (dayid, teacherid, sessiontypeid, promoid, specialityid, starttime, duration, period) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

        for (const session of formattedSchedule) {
            const dayId = dayMap[session.day_of_week];
            const teacherId = teacherMap[session.teacher];
            const sessionTypeId = sessionTypeMap[session.session_type];
            const promoId = promotionMap[session.promotion];
            const specialityId = session.speciality ? specialityMap[session.speciality] : null;

            if (!dayId|| !teacherId||!sessionTypeId || !promoId){
                console.error("Missing mapping for:", session)
                continue;
            }

            await conn.query(query, [dayId,teacherId,sessionTypeId,promoId,specialityId,session.start_time,session.duration_minutes, counter])}

        res.json({message:"time table saved!" })

    } catch (error){
        res.status(500).json({ error: "Internal server error" });
    } 
    
    
    finally {
        if (conn) conn.release()
    }
}
