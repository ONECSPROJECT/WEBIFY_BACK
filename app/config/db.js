const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: "127.0.0.1",
    user: "root",
    port: 6001, 
    password: "rootpassword",
    database: "suphours",
    connectionLimit: 5, // Reduce this
    acquireTimeout: 60000, //
    queueLimit: 0
});

async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('✅ Connected! Connection ID:', conn.threadId);
        conn.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

testConnection();

module.exports = pool;
