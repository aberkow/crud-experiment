module.exports = {
  queryDB: async (pool, queryString) => {
    try {
      const result = await pool.query(queryString)
      return result;
    } catch (error) {
      throw new Error(`queryDB error -> ${error}`)
    }
  }
}