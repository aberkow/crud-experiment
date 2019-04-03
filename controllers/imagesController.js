const pool = require('../utils/pool');
const {
  queryDB,
  getHost
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
      .then(res => {
        if (res.length > 0) {
          res.found = true
          return res
        } else {
          return {
            found: false, 
            message: `no image found for image with id ${id}.`
          }
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err), '\t'), 'err')
        return err
      })
  },
  createPostFeaturedImage: async (req) => {
    const id = parseInt(req.params.id)
    const { mimetype, originalname } = req.file
    const imageTitle = req.body.post_title
    const guid = `${getHost(req)}/public/uploads/${originalname}`
    console.log(file.originalname);

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
        post_type,
        post_mime_type
      ) VALUES (
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        '',
        ?,
        '',
        'inherit',
        'closed',
        'closed',
        '',
        '',
        '',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        '',
        ?,
        ?,
        'attachment',
        ?
      )
    `

    const insertValues = [ imageTitle, id, guid, mimetype ]

    const insertQuery = { sql: insertSql, values: insertValues }

    const insertPromise = await queryDB(pool, insertQuery)
        .then(res => {
          console.log(res, 'res from insert');
          return res
        })
        .catch(err => {
          console.log(err, 'err from insert');
        })

    return Promise.all([ insertPromise ])
        .then(res => res)
        .catch(err => err)
  }
}