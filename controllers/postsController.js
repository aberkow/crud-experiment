const pool = require('../utils/pool');
const { queryDB } = require('../utils/helpers');

/** 
 * 
 * Interactions with the database for posts
 * Each function takes in the req to handle query params
 * 
*/
module.exports = {
  getPosts: async (req) => {

    const status = req.query.status || 'publish'
    const type = req.query.type || 'post'
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (limit + 1) * (page - 1);

    const sql = `
    SELECT * FROM wp_posts 
      WHERE post_status LIKE ?
      AND post_type LIKE ?
      LIMIT ?
      OFFSET ?
    `
    
    /**
     * 
     * Even though the values are escaped, it's useful to encode sepcial characters.
     * this way if someone enters i
     * - ?type=pos"t -> "pos%22t"
     * - ?type='%20or%201=1-- -> "'%20or%201%3D1--"
     * 
     */
    const query = {
      sql,
      values: [encodeURIComponent(status), encodeURIComponent(type), limit, offset]
    }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => err)
  },
  getPostByName: async (req) => {
    const name = req.params.name
    const status = 'publish'

    const sql = `
      SELECT * FROM wp_posts WHERE post_name=?
        AND post_status=?
    `

    const values = [ encodeURIComponent(name), status ]

    const query = { sql, values }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => err)
  },
  getPostById: async (req) => {

    // ids should only ever be integers.
    // malicious strings will fail automatically
    const id = parseInt(req.params.id)

    const sql = `
      SELECT * FROM wp_posts WHERE ID=?
    `

    const values = [ id ]

    const query = { sql, values }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => err)
  },

  /**
   * 
   * Create a new post when /posts/new is visited
   * The new post object is returned when Promise.all resolves
   * 
   */
  createPost: async (req) => {
    const isSecure = req.secure
    const scheme = isSecure ? 'https' : 'http'
    const host = req.headers.host

    const guid = `${scheme}://${host}?p=`

    const insertSql = `
    INSERT INTO wp_posts (
      post_author,
      post_date,
      post_date_gmt,
      post_content,
      post_title,
      post_excerpt,
      post_status,
      comment_status,
      ping_status,
      post_name,
      to_ping,
      pinged,
      post_modified,
      post_modified_gmt,
      post_content_filtered,
      post_parent,
      guid,
      post_type
    ) VALUES (
      1,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP,
      'Have a little content to get started!',
      'Post ID ',
      '',
      'auto-draft',
      'closed',
      'closed',
      '',
      '',
      '',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP,
      '',
      0,
      ?,
      'post'
    );
  `
    const insertVals = [ guid ]

    const insertQuery = {
      sql: insertSql,
      values: insertVals
    }

    const udpateSql = `
      UPDATE wp_posts
        SET guid=CONCAT(guid, LAST_INSERT_ID()), post_title=CONCAT(post_title, LAST_INSERT_ID())
        WHERE ID=LAST_INSERT_ID();
    `

    const updateQuery = { sql: udpateSql }

    const getSql = `
      SELECT * FROM wp_posts WHERE ID=LAST_INSERT_ID()
    `

    const getQuery = { sql: getSql }

    const insertPromise = await queryDB(pool, insertQuery);
    const updatePromise = await queryDB(pool, updateQuery);
    const getPromise = await queryDB(pool, getQuery)
    return Promise.all([insertPromise, updatePromise, getPromise])
    // destructure the results of the awaited promises.
    // this way you just get back the value of the newly inserted post
      .then(([insertRes, updateRes, getRes]) => {
        return getRes
      })
      .catch(err => err)
  },
  deletePostById: async (req) => {
    let trashSql
    const id = parseInt(req.params.id)
    const values = [ id ]

    const statusCheckSql = `
      SELECT wp_posts.post_status 
        FROM wp_posts 
        WHERE wp_posts.ID=?
    `

    const statusCheckQuery = { 
      sql: statusCheckSql, 
      values 
    }

    const status = await queryDB(pool, statusCheckQuery)
      .then(res => res[0])
      .catch(err => err)

    if (status.post_status !== 'trash') {
      trashSql = `
        UPDATE wp_posts
          SET post_status='trash'
          WHERE wp_posts.ID=?
      `
    } else {
      trashSql = `
        DELETE FROM wp_posts WHERE ID=?
      `
    }

    const query = {
      sql: trashSql,
      values
    }

    await queryDB(pool, query)
      .then(res => {
        return res
      })
      .catch(err => err)
  }
}