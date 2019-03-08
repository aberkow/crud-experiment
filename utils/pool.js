const mysql = require('mysql')
const util = require('util')

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('DB connection closed');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('DB has too many connections');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('DB connection refused');
    }
  }

  if (connection) connection.release()

  return
})

pool.query = util.promisify(pool.query)

module.exports = pool;