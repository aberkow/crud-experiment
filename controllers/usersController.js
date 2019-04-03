const pool = require('../utils/pool');
const { queryDB } = require('../utils/helpers');

module.exports = {
  getUsers: async (req) => {

    /**
     * 
     * the LIKE statement needs to have the %'s.
     * therefore it's important to redefine the value after the request comes in.
     * 
     */
    let role = req.query.user_role || 'administrator'

    role = `%${role}%`

    const sql = `
      SELECT wp_users.ID, wp_users.user_email, wp_users.display_name, wp_usermeta.meta_key, wp_usermeta.meta_value 
	      FROM wp_users
		    INNER JOIN wp_usermeta ON wp_users.ID = wp_usermeta.user_id
        WHERE meta_key="wp_capabilities" AND meta_value LIKE ?`;

    const query = {
      sql,
      values: [ role ]
    }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => err)
  },
  getUserById: async (req) => {

    const id = req.params.id

    const sql = `
      SELECT wp_users.*, wp_usermeta.*
        FROM wp_users
        INNER JOIN wp_usermeta ON wp_users.ID = wp_usermeta.user_id
        WHERE wp_users.ID = ?
    `

    const query = {
      sql,
      values: [ id ]
    }

    return await queryDB(pool, query)
      .then(results => results)
      .catch(err => err)

  }
}