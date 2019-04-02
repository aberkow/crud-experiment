const pool = require('../utils/pool');
const {
  queryDB
} = require('../utils/helpers');

module.exports = {
  /**
   * 
   * gets a posts featured image by the ID of the post
   * NOT the id of the image.
   * the id is passed to a nested SELECT statement to find the crossreferenced values of the image
   * 
   */
  getPostFeaturedImageByID: async (req) => {
    const id = parseInt(req.params.id)
    const values = [ id ]
    // just looking at meta values for now.
    const sql = `
    SELECT post_id, meta_value FROM wp_postmeta 
      WHERE post_id=(
        SELECT meta_value
        FROM wp_postmeta
        WHERE meta_key="_thumbnail_id"
        AND post_id=?
      )
      `
      const query = { sql, values }
    return await queryDB(pool, query)
      .then(res => res)
      .catch(err => {
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err), '\t'), 'err')
        return err
      })
  }
}