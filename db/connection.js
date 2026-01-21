const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_mysql_password',
  database: process.env.DB_NAME || 'resumeseeker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 2000,
  timeout: 30000,
});

// Test the connection
async function testConnection() {
  try {
    console.log('Attempting to connect to MySQL database...');
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
};
