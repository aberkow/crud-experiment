module.exports = {
  /**
   * 
   * make a DB query 
   * @argument pool the connection pool for the db
   * @argument queryObj the query for the db. Includes escaped values
   * see: 
   *   - https://github.com/mysqljs/mysql#performing-queries
   *   - https://github.com/mysqljs/mysql#escaping-query-values
   * 
   * @return {object or array}
   * 
   */
  queryDB: async (pool, queryObj) => {
    try {
      const result = await pool.query(queryObj)
      return result;
    } catch (error) {
      throw new Error(`queryDB error -> ${error}`)
    }
  },

  /**
   * 
   * Get the value of the timezones.
   * Helps with POSTing or PUTing new data to the db.
   * 
   * @argument pool - the db connection pool
   * 
   * @return {array}
   */
  getTimeZoneOffset: async (pool) => {
    let result;
    try {
      const sql = `
        SELECT option_name, option_value FROM wp_options
          WHERE option_name=?
            OR option_name=?
      `
      // escape the requested values just in case...
      const values = ["gmt_offset", "timezone_string"]

      const queryObj = { sql, values }

      result = await pool.query(queryObj)
      return result;
    } catch (error) {
      throw new Error(`queryDB error -> ${error}`)
    }
  }
}