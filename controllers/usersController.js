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

  },
  createUser: async (req) => {

    const { body } = req

    const userLogin = body.userLogin
    const userPass = body.userPass
    const userNicename = body.userNicename || userLogin
    const userEmail = body.userEmail
    const userUrl = body.userUrl || ''
    const userActivationKey = body.userActivationKey || ''
    const displayName = body.displayName || userLogin

    const validateUsernameSql = `
      SELECT * FROM wp_users
        WHERE user_login = ?
        LIMIT 1
    `

    const validateUsernameValue = [
      userLogin
    ]

    const validateUsernameQuery = {
      sql: validateUsernameSql,
      values: validateUsernameValue
    }

    const validateUsernamePromise = await queryDB(pool, validateUsernameQuery)
      .then(res => {
        console.log(JSON.stringify(res, null, '\t'), 'res')
        if (res.length) {
          Promise.reject('That username already exists')
        }
        return true
      })
      .catch(err => err)

    const newUserInsertSql = `
      INSERT INTO wp_users (
        user_login,
        user_pass,
        user_nicename,
        user_email,
        user_url,
        user_registered,
        user_activation_key,
        user_status,
        display_name,
        spam,
        deleted
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        CURRENT_TIMESTAMP,
        ?,
        0,
        ?,
        0,
        0
      )
    `
    
    const userValues = [
      userLogin,
      userPass,
      userNicename,
      userEmail,
      userUrl,
      userActivationKey,
      displayName
    ]

    const userInsertQuery = { sql: newUserInsertSql, values: userValues }

    const userInsertPromise = await queryDB(pool, userInsertQuery)

    return Promise.all([validateUsernamePromise, userInsertPromise])
      .then(([validateUsernameRes, userInsertRes]) => {
        console.log(JSON.stringify(validateUsernameRes, null, '\t'), 'valid res')
        
        return true
      })
      .catch(err => err)
      .then(res => {
        console.log(JSON.stringify(res, null, '\t'), 'last res')
        return res
      })
    // return await queryDB(pool, userInsertQuery)
    //   .then(results => results)
    //   .catch(err => err);
  }
}