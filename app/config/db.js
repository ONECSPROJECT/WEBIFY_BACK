const mariadb = require('mariadb');

const pool = mariadb.createPool({
    connectionLimit:2000,
    host: 'webify_back-db-1',
    user: 'root',
    password: 'rootpassword',
    database: 'suphours'
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
