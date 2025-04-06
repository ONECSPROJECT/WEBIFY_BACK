const db = require('../config/db');


exports.markAbsence=async(req,res)=>{
    const {teacher,day,absentSessions}=req.body;
    try{
        let conn =await db.getConnection()

        let dayid=await conn.query(`select dayid from dayofweek where name=?`,[day])
    console.log("day id is",dayid[0].dayid)
        if(dayid[0]){
        await conn.query(`update globaltimetableplanb set presence=0 where teacherid=? and dayid=? and isextra=1 and starttime in (?)`,[teacher,dayid[0].dayid,absentSessions])}
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}