const db = require('../config/db');

exports.getRanks=async(req,res)=>{
    try{
        let conn=await db.getConnection()
        let Ranks=await conn.query(`select rank_id, name from Ranks`)
        console.log(Ranks)
        res.status(200).json(Ranks)
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}

exports.getTeachers = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const teachers = await conn.query(
            'SELECT user_id, first_name, last_name FROM User where masked=0',
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
      const teachers = await conn.query(`
        SELECT
          u.user_id,
          CONCAT(u.first_name, ' ', u.last_name) AS full_name,
          a.email,
          u.faculty AS faculty,
          u.payment_information,
          u.state,
          u.masked,
          r.name AS current_rank
        FROM User u
        INNER JOIN Account a ON u.user_id = a.user_id
        LEFT JOIN (
          SELECT t1.teacher_id, t1.rank_id
          FROM TeacherRankHistory t1
          INNER JOIN (
            SELECT teacher_id, MAX(start_date) AS max_start
            FROM TeacherRankHistory
            GROUP BY teacher_id
          ) t2 ON t1.teacher_id = t2.teacher_id AND t1.start_date = t2.max_start
        ) trh ON u.user_id = trh.teacher_id
        LEFT JOIN Ranks r ON trh.rank_id = r.rank_id
        where masked=0 and u.user_id>1
      `);
      console.log(teachers)
      res.status(200).json(teachers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch teachers" });
    } finally {
      if (conn) conn.release();
    }
  };








exports.getPromotions =async(req, res) => {
    try {
        const conn = await db.getConnection();
        const promotions = await conn.query('SELECT DISTINCT name FROM Promotion');
        res.status(200).json(promotions);
        conn.release();
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' });
    }
}



exports.getSessions =async (req,res)=> {
    try {
        const conn = await db.getConnection()
        const sessions = await conn.query('SELECT DISTINCT name FROM SessionType')
        res.status(200).json(sessions);
        conn.release();
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
}



exports.getSpeciality =async(req, res) =>{
    const {promotion} = req.query;
    if (!promotion) return res.status(400).json({ error: 'Missing promotion parameter' });

    try {
        const conn = await db.getConnection();
        const specialities = await conn.query(
            'SELECT speciality_id, name FROM speciality WHERE promoid = (SELECT promoid FROM Promotion WHERE name = ?)',
            [promotion]
        );
        res.status(200).json(specialities)
        conn.release()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}





exports.getSpecialityName=async (req, res)=> {
    const {speciality_id} = req.query;
    if (!speciality_id) return res.status(400).json({ error: "Missing speciality_id parameter" });

    try {
        const conn = await db.getConnection();
        const rows = await conn.query("SELECT name FROM speciality WHERE speciality_id = ?", [speciality_id]);
        conn.release()
        console.log("Fetched speciality:",rows[0].name)

        res.status(200).json({name: rows.length > 0 ? rows[0].name: "Null" });
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};




exports.fetchAdminName=async (req,res)=>{
    try{
        let conn=await db.getConnection();
    const full_name= await conn.query(`select concat(last_name,' ',first_name) as full_name from User where user_id=1;`)
    res.status(200).json(full_name[0])
    console.log("full name:",full_name[0])
    conn.release()
    }
    catch(error){
        console.log(error)
    }
}
exports.fetchAdminEmail=async(req,res)=>{
    try{
        let conn=await db.getConnection()
        const email=await conn.query(`select email from Account where role='admin';`)
        res.status(200).json(email[0])
        conn.release()
    }
    catch(error){
        console.error(error)
    }
}

exports.getSched=async (req,res) =>{
    const {date}=req.query;
    try{
      const conn=await db.getConnection()
      const period_id=await conn.query(`select period_id from Periods where start_date<=? and ?<=end_date`,[date,date])
      console.log("period is ",period_id[0])
      const scheds =await conn.query(`
        select g.presence, g.starttime, g.duration, g.period, d.name as day_of_week, concat(u.last_name, ' ', u.first_name) as teacher, s.name as session_type, spec.name as speciality, p.name as Promotion from globaltimetableplanb g left join User u on g.teacher_id = u.user_id left join SessionType s on g.sessiontypeid = s.session_type_id left join speciality spec on g.speciality_id = spec.speciality_id left join Promotion p on g.promoid = p.promoid left join DayOfWeek d on g.day_id = d.day_id where g.isextra = 1 and g.period=?`,[period_id[0].period_id])

      res.json({scheds,period_id:period_id[0].period_id})
      console.log(scheds)
    } catch (error){
      console.error("Error fetching schedules:",error)

    }
  }





exports.getHolidays=async(req,res)=>{
    let {date}=req.query;
    try{
        let conn=await db.getConnection()
        let holidayApproval=await conn.query(`select holiday_id from Holidays where ? >start_date and ?<end_date; `,[date,date])
        console.log(holidayApproval)
        res.status(200).json(holidayApproval[0]||null)
        conn.release()
    }
    catch(error){
        res.status(500).json(error)
    }
}


exports.getSelectiveTeachers=async (req,res)=>{
    const{date,day}=req.query;
    try{
        let conn=await db.getConnection()
        console.log("day",req.query)
        let day_id=await conn.query(`select day_id from DayOfWeek where name =?`,[day])
        console.log("day id is, ",day_id[0])
        console.log("length",day_id.length)
        if (day_id[0].day_id===6){
            res.status(200).json("Friday")
            conn.release()
            return;
        }
        let selectiveTeachers=await conn.query(`select distinct teacher_id from globaltimetableplanb where isextra=1 and day_id=? `,[day_id[0].day_id])
        console.log("selective teachers:",selectiveTeachers)
        if(selectiveTeachers[0]){
            let vacationedTeachers=await conn.query(`select distinct teacher_id from Vacation where ?>=start_date and ?<=end_date`,[date,date])
            console.log("vacationed teachers:",vacationedTeachers)
            if (vacationedTeachers.length>0) {
                let vacationedTeacherIds = vacationedTeachers.map(v => v.teacher_id);
                selectiveTeachers = selectiveTeachers.filter(teacher => !vacationedTeacherIds.includes(teacher.teacher_id));
            }
            let teacherIds =selectiveTeachers.map(t=> t.teacher_id)
            if (teacherIds.length >0) {
                let teacherDetails= await conn.query(
                    `select user_id as teacher_id, first_name,last_name from User where user_id in (?)`, [teacherIds])
                selectiveTeachers = teacherDetails
            }
        }
        console.log("teacher details: ",selectiveTeachers)
       if(!selectiveTeachers[0]){
        res.status(200).json("No teacher has extra sessions today")
       }
       else{
        res.status(200).json(selectiveTeachers)
       }
       conn.release()
    }
    catch(error){
        console.log(error)
    }
}


exports.getExtraSessions=async(req,res)=>{
    const {teacher,day}=req.query;
    try{
        let conn=await db.getConnection()
        let day_id=await conn.query(`select day_id from DayOfWeek where name=?`,[day])
        console.log(day_id[0].day_id)
        const sessions=await conn.query(`select starttime, duration from globaltimetableplanb where teacher_id=? and day_id=? and isextra=1`,[teacher,day_id[0].day_id])
        res.status(200).json(sessions)
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}


exports.getPeriod=async(req,res)=>{
    const{date}=req.query;
    try{
        let conn=await db.getConnection()
        let PeriodId=await conn.query(`select period_id from Periods where start_date<=? and ?<=end_date`,[date,date])
        console.log("period id is ",PeriodId[0].period_id)

        res.status(200).json(PeriodId[0].period_id)
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}

exports.getWeekend=async(req,res)=>{
    const {day}=req.query;
    try{
        let conn=await db.getConnection()
        let days=await conn.query(`select day_id from DayOfWeek where name =?`,[day])
        console.log("days length ",days)
        if(days.length===0){
            res.status(200).json("Weekend")
        }
        else if (days[0].day_id===6){
            res.status(200).json("Friday")
        }
      else{
        res.status(200).json("not a weekend")
    }
      conn.release()
    }
    catch(error){
        console.log(error)
    }
}

exports.getTeacherForPaymentPage = async (req, res) => {
    const {date}=req.query
    try {
        let conn =await db.getConnection()
        let period_id=await conn.query(`select period_id from Periods where start_date<=? and ?<=end_date`,[date, date])

        let teachers = await conn.query(`select p.paymentid, p.teacher_id, u.full_name as teacher, p.suphour, p.totalPayment, p.status from Payment p join User u on p.teacher_id = u.user_id where p.period_id=? and u.masked=0 `, [period_id[0].period_id])
        res.status(200).json({teachers,period:period_id[0].period_id})
        console.log(teachers)
        conn.release()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server error" })
    }
}


