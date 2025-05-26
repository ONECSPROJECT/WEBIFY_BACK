const mariadb = require('mariadb');

const pool = mariadb.createPool({
    connectionLimit:2000,
    host: 'localhost',
    user: 'root',
    password: 'BecauseEverybodyIsChanging!!+6367',
    database: 'planB'
});




async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('connected ! connection id is ' + conn.threadId);
        conn.release(); //release to pool
    } catch (err) {
        console.log('not connected due to error: ' + err);
    }
}

testConnection();
module.exports = pool;
