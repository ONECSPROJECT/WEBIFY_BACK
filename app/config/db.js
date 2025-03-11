const mariadb = require('mariadb');

async function asyncFunction() {
    // I know that this isn't secure and that I should use env variables instead, but whatever
    const conn = await mariadb.createConnection({
        host: 'db',
        user: 'root',
        password: 'rootpassword',
        database: 'suphours'
    });

    try {
        const res = await conn.query('SELECT NOW()');
        console.log(res); // [ { 'NOW()': 2018-07-02T17:06:38.000Z } ]
        return res;
    } finally {
        conn.end();
    }
}

asyncFunction();
