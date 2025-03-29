const db = require('../config/db');



exports.getTeachers = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const teachers = await conn.query(
            'SELECT first_name, last_name FROM user',
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
        const teachers = await conn.query(
            `SELECT 
                CONCAT(U.first_name,' ', U.last_name) AS full_name,
                A.email,
                U.faculty AS grade,
                U.payment_information,
                U.state
            FROM User U
            INNER JOIN Account A ON U.user_id = A.user_id`
        );
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
};







exports.getPromotions = async (req, res) => {
    try {
        const conn = await db.getConnection();
        const promotions = await conn.query('SELECT DISTINCT name FROM Promotion');
        res.status(200).json(promotions);
        conn.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}



exports.getSessions = async (req, res) => {
    try {
        const conn = await db.getConnection()
        const sessions = await conn.query('SELECT DISTINCT name FROM sessiontype')
        res.status(200).json(sessions);
        conn.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}



exports.getSpeciality = async (req, res) => {
    const { promotion } = req.query;
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





exports.getSpecialityName = async (req, res) => {
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

exports.getSched=async(req,res)=>{
    const {promoid}=req.query
    if (!promoid) return res.status(400).json({error: "missing promoid" });

    try {
        const conn= await db.getConnection()
        const scheds= await conn.query(`
           select 
    g.starttime,
    g.duration,
    g.period,
    d.name as day_of_week,
    concat(u.last_name,' ',u.first_name) as teacher,
    s.name as session_type,
    spec.name as speciality,
    p.name as promotion,
    g.isExtra
FROM globaltimetableplanb g
left join user u on g.teacherid = u.user_id
left join sessiontype s on g.sessiontypeid = s.session_type_id
left join speciality spec on g.specialityid = spec.specialityid
left join promotion p on g.promoid = p.promoid
left join dayofweek d on g.dayid = d.dayid
WHERE g.promoid = ?;
`,[promoid])

        res.status(200).json(scheds);
        if(promoid==4){
            console.log("response: ",scheds)}
        conn.release()
    } catch(error){
        console.error(error)
        res.status(500).json({error:'Server error' });
    }
}