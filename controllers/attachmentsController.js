const pool = require('../utils/pool');
const {
  queryDB,
  getHost,
  getPostDbColumns
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
  /**
   * 
   * Creates a row in the wp_posts table for an attachment.
   * Requires that an attachment be uploaded via multer (see /utils/upload)
   * 
   * The id passed with the request is the parent post for the featured image.
   * 
   */
  createPostFeaturedImage: async (req) => {
    const id = parseInt(req.params.id)
    const { mimetype, filename } = req.file
    const imageTitle = req.body.post_title
    const guid = `${getHost(req)}/public/uploads/${filename}`
    const tempName = filename.split('.')[0].split(' ')
    let postName

    if (tempName.length > 1) {
      postName = tempName.join('-').toLowerCase()
    } else {
      postName = tempName[0].toLowerCase()
    }

    const insertSql = `
      INSERT INTO wp_posts (
        ${getPostDbColumns()}
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
        ?, 
        '', 
        '',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        '',
        ?,
        ?,
        0,
        'attachment',
        ?,
        0
      )
    `

    const insertValues = [ imageTitle, postName, id, guid, mimetype ]

    const insertQuery = { sql: insertSql, values: insertValues }

    const insertPromise = await queryDB(pool, insertQuery)
        .then(res => res)
        .catch(err => {
          console.log(err, 'err from insert');
          return err
        })

    const insertMetaSql = `
        INSERT INTO wp_postmeta (
          post_id,
          meta_key,
          meta_value
        ) VALUES (
          ?,
          "_thumbnail_id",
          (
            SELECT ID FROM wp_posts
              WHERE post_name=?
          )
        )
    `
    const insertMetaValues = [ id, postName ]

    const insertMetaQuery = {
      sql: insertMetaSql,
      values: insertMetaValues
    }
    
    const insertMetaPromise = await queryDB(pool, insertMetaQuery)
      .then(res => res)
      .catch(err => {
        console.log(err, 'err from insert');
        return err
      })

    return Promise.all([ insertPromise, insertMetaPromise ])
        .then(res => res)
        .catch(err => err)
  }
}