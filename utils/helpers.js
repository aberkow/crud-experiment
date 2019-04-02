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
      return error
    }
  },
  /**
   * 
   * Get the current host with http scheme
   * 
   */
  getHost: (req) => {
    try {
      const isSecure = req.secure
      const scheme = isSecure ? 'https' : 'http'
      const host = req.headers.host
  
      return `${scheme}://${host}`
    } catch (err) {
      console.log(JSON.stringify(err, Object.getOwnPropertyNames(err), '\t'), 'err -> did you pass the request object?')
    }
  },
  getUniquePostWhere: (unique) => {
    let where

    if (typeof (unique) === "number") {
      where = `
        WHERE wp_posts.ID=?
      `
    } else if (typeof (unique) === "string") {
      where = `
        WHERE wp_posts.post_name=?
      `
    } else {
      console.log(`Where needs to be a string or number. You passed in a ${typeof(unique)}`)
    }

    return where;
  },
}