module.exports = {
  /**
   * 
   * make a DB query 
   * this function can either store its result in a variable 
   * or pass it off to a then/catch chain
   * 
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
    let result;
    try {
      result = await pool.query(queryObj)
      return result;
    } catch (error) {
      throw new Error(`queryDB error -> ${error}`)
    }
  },
}