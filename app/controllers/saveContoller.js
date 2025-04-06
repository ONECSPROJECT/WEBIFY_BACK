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



exports.saveHoliday=async (req,res)=>{
    const {startDate,endDate}=req.body;
    try{
        let conn= await db.getConnection()
        let response=await conn.query(`insert into holidays (startdate,enddate) values (?,?);`,[startDate,endDate])
        res.status(200).json("holiday saved!")
        conn.release()
        }
    catch(error){
        console.error(error)
    }
}


exports.saveSemesters=async (req,res)=>{
    const {academicSemesters}=req.body;
    try{
        let conn=await db.getConnection()
       for(const s of ["semestre1","semestre2"]){
        await conn.query(
            `insert into semesters (name,startdate,enddate) values (?, ?,?)`,[academicSemesters[s].name, academicSemesters[s].start,academicSemesters[s].end]
          )
       }
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}

exports.savePeriods=async(req,res)=>{
    const{academicPeriods}=req.body
    try{
        let conn=await db.getConnection()
        for(const s of ["periode1","periode2","periode3"]){
            await conn.query(
                `insert into periods (name,startdate,enddate,semesterid) values (?, ?,?,?)`,[academicPeriods[s].name, academicPeriods[s].start,academicPeriods[s].end,academicPeriods[s].Semesterid]
              )
           }
            res.status(200).json("nice")
            conn.release()
        }
        catch(error){
            console.log(error)
        }
    
}

exports.saveVacations=async(req,res)=>{
    const {teacher,startDate,endDate}=req.body;
    try{
        let conn=await db.getConnection()
        let semesterid=await conn.query(`select semesterid from semesters where startdate<=? and ?<=enddate`,[startDate,endDate])
        if (semesterid){
            await conn.query(`insert into vacation(teacherid, startdate, enddate,semesterid) values (?,?,?,?);`,[teacher,startDate,endDate,semesterid[0].semesterid])
            res.status(200).json("nice")
            console.log("done")
            conn.release()
        }
    }
    catch(error){
        console.log(error)
    }
}