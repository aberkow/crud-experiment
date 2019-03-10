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
   * @return result object or array
   * 
   */
  queryDB: async (pool, queryObj) => {
    try {
      const result = await pool.query(queryObj)
      return result;
    } catch (error) {
      throw new Error(`queryDB error -> ${error}`)
    }
  }
}