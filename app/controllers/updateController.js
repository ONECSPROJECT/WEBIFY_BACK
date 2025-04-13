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


exports.addSupHours=async(req,res)=>{
    const {teachers,date}=req.query
    try{
        let conn=await db.getConnection()
        let periodid=await conn.query(`select periodid from periods where startdate<=? and ?<=enddate`,[date, date])
        let pid=periodid[0].periodid
        for(let teacher  of teachers){
            let user_id=teacher.user_id
            let durations=await conn.query(`
                select 
                    sum(case when sessiontypeid=1 then duration else 0 end) as suphourcourse,
                    sum(case when sessiontypeid=2 then duration else 0 end) as suphourtut,
                    sum(case when sessiontypeid=3 then duration else 0 end) as suphourlab
                from globaltimetableplanb
                where teacherid=? and isExtra=1
            `,[user_id])
            let d=durations[0]
            await conn.query(`update payment set suphourcourse=?, suphourtut=?, suphourlab=? where teacherid=? and periodid=?`,
            [d.suphourcourse||0,d.suphourtut||0,d.suphourlab||0,user_id,pid])
        }
        res.status(200).json({message:"sup hours updated"})
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}


exports.resetPresence=async(req,res)=>{
    const{date}=req.query
    try{
        let conn=await db.getConnection()
        let periodid=await conn.query(`select periodid from periods where startdate<=? and ?<=enddate`,[date, date])
        await conn.query(`update globaltimetableplanb set presence=1 where teacherid>=1`)
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}