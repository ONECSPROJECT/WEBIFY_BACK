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


exports.markEnddate=async(req,res)=>{
    const{enddate}=req.query;
    try{
        let conn=await db.getConnection()
        let historyid= await conn.query(`select historyid from teacherrankhistory where enddate is null`)
        console.log("hitory is", historyid)
        await conn.query(`update teacherrankhistory set enddate=? where historyid=?`,[enddate,historyid[0].historyid])
        res.status(200).json("nice")
        conn.release()
    }
    catch(error)
    {
        console.log(error)
    }
}