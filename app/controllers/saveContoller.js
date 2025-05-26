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

        const dayRows = await conn.query("SELECT day_id, name FROM DayOfWeek");
        const teacherRows = await conn.query("SELECT user_id, CONCAT(last_name, ' ', first_name) AS full_name FROM User");
        const sessionTypeRows = await conn.query("SELECT session_type_id, name FROM SessionType");
        const promotionRows = await conn.query("SELECT promoid, name FROM Promotion");
        const specialityRows = await conn.query("SELECT speciality_id, name FROM speciality");

        console.log("Checkpoint");

        const dayMap = Object.fromEntries(dayRows.map(row => [row.name, row.day_id]));
        const teacherMap = Object.fromEntries(teacherRows.map(row => [row.full_name, row.user_id]));
        const sessionTypeMap = Object.fromEntries(sessionTypeRows.map(row => [row.name, row.session_type_id]));
        const promotionMap = Object.fromEntries(promotionRows.map(row => [row.name, row.promoid]));
        const specialityMap = Object.fromEntries(specialityRows.map(row => [row.name, row.speciality_id]));

        // 🔹 Updated query to include `isExtra`
        const query = `INSERT INTO globaltimetableplanB (day_id, teacher_id, sessiontypeid, promoid, speciality_id, starttime, duration, period, isExtra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

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
        let response=await conn.query(`insert into Holidays (start_date,end_date) values (?,?);`,[startDate,endDate])
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
            `insert into Semesters (name,start_date,end_date) values (?, ?,?)`,[academicSemesters[s].name, academicSemesters[s].start,academicSemesters[s].end]
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
                `insert into Periods (name,start_date,end_date,semester_id) values (?, ?,?,?)`,[academicPeriods[s].name, academicPeriods[s].start,academicPeriods[s].end,academicPeriods[s].Semesterid]
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
        let semester_id=await conn.query(`select semester_id from Semesters where start_date<=? and ?<=end_date`,[startDate,endDate])
        if (semester_id){
            await conn.query(`insert into Vacation(teacher_id, start_date, end_date,semester_id) values (?,?,?,?);`,[teacher,startDate,endDate,semester_id[0].semester_id])
            res.status(200).json("nice")
            console.log("done")
            conn.release()
        }
    }
    catch(error){
        console.log(error)
    }
}


exports.saveRank=async(req,res)=>{
    const{teacher,grade,date}=req.body
    try{
        let conn=await db.getConnection()
        const periodId=await conn.query(`select period_id from TeacherRankHistory where  end_date=? `,[date])
        console.log("period id is",periodId[0])
        console.log(periodId[0])
        console.log("grade to be inserted",grade)
        const addToRankHistory=await conn.query(`insert into TeacherRankHistory(teacher_id,rank_id,start_date,end_date,period_id) values(?,?,?,?,?)`,[teacher, grade,date,null,periodId[0].period_id])
        const addtoPayment=await conn.query(`insert into payment(teacher_id,suphourcourse,suphourtut,suphourlab,totalpayment,status,period_id,rank_id) values (?,?,?,?,?,?,?,?) `,[teacher,0,0,0,0,0,periodId[0].period_id,grade])
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}

function getCustomWeekNumber(day){
    if (day<=5) return 1;
    if (day <=10) return 2;
    if (day <= 15) return 3;
    if (day<= 20) return 4;
    if (day <= 25) return 5;
    return 6;
  }
exports.addRecord=async(req,res)=>{
    let {day,month}=req.query
    console.log("day and month numbers are   ",req.query)
    try{
        let conn=await db.getConnection()
        let weekNumber=getCustomWeekNumber(day)
        let teachers=await conn.query(`select  teacher_id, day_id from globaltimetableplanb  where isExtra=1 and presence=1`)
        console.log("absence record teachers are", teachers)
        if(Number(day)<7){
            month=Number(month)-1
            weekNumber=5
        }
        for(const t of teachers){
            switch (Number(t.day_id)) {
                case 5:
                    t.day_id = Number(day) - 1;
                    if (t.day_id < 0) {
                        t.day_id += 30;
                    }
                    break;
                case 4:
                    t.day_id = Number(day) - 2;
                    if (t.day_id < 0) {
                        t.day_id += 30;
                    }
                    break;
                case 3:
                    t.day_id = Number(day) - 3;
                    if (t.day_id < 0) {
                        t.day_id += 30;
                    }
                    break;
                case 2:
                    t.day_id = Number(day) - 4;
                    if (t.day_id < 0) {
                        t.day_id += 30;
                    }
                    break;
                case 1:
                    t.day_id = Number(day) - 5;
                    if (t.day_id < 0) {
                        t.day_id += 30;
                    }
                    break;
                default:
                    break;
            }
            const latestRankID= await conn.query(`select rank_id from TeacherRankHistory where teacher_id=? and end_date is null`,[t.teacher_id])
            console.log("latest rank is",latestRankID[0].rank_id)
            await conn.query(`insert  into AbsenceRecord (teacher_id, week_number, month_number,day_number,rank_id) values (?,?,?,?,?)`,[t.teacher_id,weekNumber,month,Number(t.day_id),latestRankID[0].rank_id])

        }
        res.status(200).json("nice")
        conn.release()

    }
    catch(error){
        console.log(error)
    }
}
