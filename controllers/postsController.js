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
    
    const query = {
      sql,
      values: [status, type, limit, offset]
    }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => {
        console.log(err);
        res.send({ error: err })
      })
  },
  getPostByName: async (req) => {
    const name = req.params.name

    const sql = `
      SELECT * FROM wp_posts WHERE post_name=?
    `

    const values = [ name ]

    const query = { sql, values }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => res.send({ error: err }))
  },
  getPostById: async (req) => {
    const id = req.params.id

    const sql = `
      SELECT * FROM wp_posts WHERE ID=?
    `

    const values = [ id ]

    const query = { sql, values }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => res.send({ error: err }))
  },
}