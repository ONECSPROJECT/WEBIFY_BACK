const db = require('../config/db');

exports.getRanks=async(req,res)=>{
    try{
        let conn=await db.getConnection()
        let ranks=await conn.query(`select rankid, name from ranks`)
        console.log(ranks)
        res.status(200).json(ranks)
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
            'SELECT user_id, first_name, last_name FROM user',
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
        conn =await db.getConnection()
        const teachers=await conn.query(`select u.user_id, concat(u.first_name,' ', u.last_name) as full_name,a.email,u.faculty AS faculty,u.payment_information,u.state from user u inner join Account a on u.user_id=a.user_id`);
        res.status(200).json(teachers)
    } catch(error){
        console.error(error)
    } finally {
        if (conn) conn.release()
    }
}







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
        const sessions = await conn.query('SELECT DISTINCT name FROM sessiontype')
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





exports.getSpecialityName=async (req, res)=> {
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




exports.fetchAdminName=async (req,res)=>{
    try{
        let conn=await db.getConnection();
    const full_name= await conn.query(`select concat(last_name,' ',first_name) as full_name from user where user_id=1;`)
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
        const email=await conn.query(`select email from account where role='admin';`)
        res.status(200).json(email[0])
        conn.release()
    }
    catch(error){
        console.error(error)
    }
}

exports.getSched=async (req,res) =>{
    try{
      const conn=await db.getConnection()
      const scheds =await conn.query(`
        select g.presence, g.starttime, g.duration, g.period, d.name as day_of_week, concat(u.last_name, ' ', u.first_name) as teacher, s.name as session_type, spec.name as speciality, p.name as promotion from globaltimetableplanb g left join user u on g.teacherid = u.user_id left join sessiontype s on g.sessiontypeid = s.session_type_id left join speciality spec on g.specialityid = spec.specialityid left join promotion p on g.promoid = p.promoid left join dayofweek d on g.dayid = d.dayid where g.isextra = 1`)
  
      res.json(scheds)
      console.log(scheds)
    } catch (error){
      console.error("Error fetching schedules:",error)

    }
  }
  

       


exports.getHolidays=async(req,res)=>{
    let {date}=req.query;
    try{
        let conn=await db.getConnection()
        let holidayApproval=await conn.query(`select holidayid from holidays where ? >startdate and ?<enddate; `,[date,date])
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
        let dayid=await conn.query(`select dayid from dayofweek where name =?`,[day])
        console.log("day id is, ",dayid[0])
        console.log("length",dayid.length)
        if (dayid.length===0){
            res.status(200).json("Today is a weekend")
        }
        let selectiveTeachers=await conn.query(`select distinct teacherid from globaltimetableplanb where isextra=1 and dayid=? `,[dayid[0].dayid])
        console.log("selective teachers:",selectiveTeachers)
        if(selectiveTeachers[0]){
            let vacationedTeachers=await conn.query(`select distinct teacherid from vacation where ?>=startdate and ?<=enddate`,[date,date])
            console.log("vacationed teachers:",vacationedTeachers)
            if (vacationedTeachers.length>0) {
                let vacationedTeacherIds = vacationedTeachers.map(v => v.teacherid);
                selectiveTeachers = selectiveTeachers.filter(teacher => !vacationedTeacherIds.includes(teacher.teacherid));
            }
            let teacherIds =selectiveTeachers.map(t=> t.teacherid)
            if (teacherIds.length >0) {
                let teacherDetails= await conn.query(
                    `select user_id as teacherid, first_name,last_name from user where user_id in (?)`, [teacherIds])
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
        let dayid=await conn.query(`select dayid from dayofweek where name=?`,[day])
        console.log(dayid[0].dayid)
        const sessions=await conn.query(`select starttime, duration from globaltimetableplanb where teacherid=? and dayid=? and isextra=1`,[teacher,dayid[0].dayid])
        res.status(200).json(sessions)
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}