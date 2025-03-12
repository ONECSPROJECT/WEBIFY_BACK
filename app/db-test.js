const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'rootpassword',
    database: 'suphours'
});
async function testConnection() {
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'rootpassword',
            database: 'suphours'
        });

        console.log('✅ Connected! Connection ID:', conn.threadId);
        await conn.end(); // Close the connection
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

testConnection();