const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pizzeria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  getConnection: async () => {
    return await pool.getConnection();
  },
  query: async (sql, params) => {
    const [results] = await pool.execute(sql, params);
    return results;
  }
}; 