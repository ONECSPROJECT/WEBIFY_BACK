const db = require('../config/db');


exports.deleteTeacher=async (req,res)=>{
    const {user_id}=req.query
    console.log("teacher id is",user_id )
    let conn= await db.getConnection()
    console.log("connection made")
    try{
        await conn.query(`delete from account where user_id =?;`,[user_id])
        await conn.query(`delete  from User where user_id=?;`,[user_id])
        res.status(200).json("nice")
        conn.release()
    }
    catch(error){
        console.log(error)
    }
}