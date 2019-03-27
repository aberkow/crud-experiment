// based on 
// https://medium.com/@mhagemann/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4

const mysql = require('mysql')
const util = require('util')

/**
 * 
 * Create a pool of connections to use.
 * This prevents the app from going down if a connection breaks
 * It also handles scaling, closing connections, etc...
 * 
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // debug: true
  // getConnection: 0,
  // connectionLimit: 20
})

/**
 * 
 * Error handling for the pool.
 * If there's no error, make the connection.
 * 
 */
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

/**
 * 
 * Allow DB queries to be made with async/await.
 * 
 */
pool.query = util.promisify(pool.query)

module.exports = pool;