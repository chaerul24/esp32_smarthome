const mysql = require("mysql2/promise");
const logger = require("../utils/logger");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "chaerul26",
  database: "location_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ======================
// 🔌 TEST CONNECTION
// ======================
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    logger.log("✅ MySQL Connected");
    conn.release();
  } catch (err) {
    logger.error("❌ MySQL Error: " + err.message);
  }
}

// ======================
// 🔥 QUERY HELPER
// ======================
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    logger.error("❌ MySQL Query Error: " + err.message);
    throw err;
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};