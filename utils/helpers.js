module.exports = {
  /**
   * 
   * make a DB query 
   * @argument pool the connection pool for the db
   * @argument queryString the query for the db
   * 
   * @return result object or array
   * 
   */
  queryDB: async (pool, queryString) => {
    try {
      const result = await pool.query(queryString)
      return result;
    } catch (error) {
      throw new Error(`queryDB error -> ${error}`)
    }
  }
}