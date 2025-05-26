const e = require('express');
const db = require('../config/db');


exports.markAbsence=async(req,res)=>{
    const {teacher,day,absentSessions}=req.body;
    try{
        let conn =await db.getConnection()

        let day_id=await conn.query(`select day_id from DayOfWeek where name=?`,[day])
    console.log("day id is",day_id[0].day_id)
        if(day_id[0]){
        await conn.query(`update globaltimetableplanb set presence=0 where teacher_id=? and day_id=? and isextra=1 and starttime in (?)`,[teacher,day_id[0].day_id,absentSessions])}
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}


exports.markEnddate=async(req,res)=>{
    const{end_date}=req.query;
    try{
        let conn=await db.getConnection()
        let history_id= await conn.query(`select history_id from TeacherRankHistory where end_date is null`)
        console.log("hitory is", history_id)
        await conn.query(`update TeacherRankHistory set end_date=? where history_id=?`,[end_date,history_id[0].history_id])
        res.status(200).json("nice")
        conn.release()
    }
    catch(error)
    {
        console.log(error)
    }
}


exports.addSupHours=async(req,res)=>{
    const {teachers,date}=req.body
    try{
        let conn=await db.getConnection()
        let period_id=await conn.query(`select period_id from Periods where start_date<=? and ?<=end_date`,[date, date])
        let pid=period_id[0].period_id
        console.log("teacher to add sup hours:",teachers)
        for(let teacher  of teachers){
            let user_id=teacher.user_id
            let durations=await conn.query(`
                select 
                    sum(case when sessiontypeid=1 then duration else 0 end) as suphourcourse,
                    sum(case when sessiontypeid=2 then duration else 0 end) as suphourtut,
                    sum(case when sessiontypeid=3 then duration else 0 end) as suphourlab
                from globaltimetableplanb
                where teacher_id=? and isExtra=1 and presence=1
            `,[user_id])
            console.log("USER ID", user_id)
            
            let latestRankID= await conn.query(`select rank_id from TeacherRankHistory where teacher_id=? and end_date is null`,[user_id])

            console.log("LATEST RANK",latestRankID[0])
            let paymentperhour=await conn.query(`select payment from Ranks where rank_id=?`,[latestRankID[0].rank_id])
            let d=durations[0]
            await conn.query(`update payment set suphour=?, suphourcourse=?, suphourtut=?, suphourlab=?, totalpayment=? where teacher_id=? and period_id=?`,
            [(Number(d.suphourcourse)+Number(d.suphourlab)+Number(d.suphourtut))||0,d.suphourcourse||0,d.suphourtut||0,d.suphourlab||0,Number(paymentperhour[0].payment)*(Number(d.suphourcourse)+Number(d.suphourlab)+Number(d.suphourtut)),user_id,pid])
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
        let period_id=await conn.query(`select period_id from Periods where start_date<=? and ?<=end_date`,[date, date])
        await conn.query(`update globaltimetableplanb set presence=1 where teacher_id>=1`)
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}


exports.maskTeacher=async(req,res)=>{
    const {user_id}=req.query
    try{
        let conn=await db.getConnection()
        await conn.query(`update user set masked =1 where user_id=?`,[user_id])
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}


exports.markAsPaid=async(req,res)=>{
    const {id}=req.query
    try{
        let conn=await db.getConnection()
        await conn.query(`update payment set status =1 where paymentid=?`,[id])
        res.status(200).json("nice")
    }
    catch(error){
        console.log(error)
    }
}