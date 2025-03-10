const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST || 'db',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'rootpassword',
  database: process.env.DATABASE_NAME || 'suphours'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

module.exports = connection;

