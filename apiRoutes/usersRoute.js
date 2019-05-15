const express = require('express');
const usersRoute = express.Router();

const php = require('js-php-serialize')

const pool = require('../utils/pool')
const { queryDB } = require('../utils/helpers')

const { 
  getUsers, 
  getUserById,
  createUser 
} = require('../controllers/usersController')

usersRoute.get('/', async (req, res) => {

  await getUsers(req)
    .then(data => res.send(data))
    .catch(err => res.send({ error: err }))

})

usersRoute.get('/:id', async (req, res) => {
  await getUserById(req)
    .then(data => res.send(data))
    .catch(err => res.send({ error: err }))
})

usersRoute.post('/new', async (req, res) => {
  await createUser(req)
    .then(data => res.send(data))
    .catch(err => res.send({ error: err }))
})




// usersRoute.post('/new', async (req, res) => {
//   const sql = `
//   INSERT INTO wp_usermeta (
// 		user_id,
// 		meta_key,
// 		meta_value
// 	) VALUES (
// 		1,
// 		'test',
// 		?
// 	);`

//   // js-php-serialize doesn't encode dangerous strings.
//   // sanitize them with encodeURIComponent
//   const test = php.serialize({ 
//     attack: encodeURIComponent('</script>')
//   })

//   const values = [ test ]  


//   const query = {
//     sql,
//     values
//   }

//   await queryDB(pool, query)
//     .then(results => res.send(results))
//     .catch(err => {
//       console.log(err);
//       res.send({ error: err })
//     })
// })

usersRoute.delete('/:id', async (req, res) => {

  const userCountSql = `
    SELECT COUNT(DISTINCT wp_users.ID) AS userCount FROM wp_users
  `

  const userCountQuery = { sql: userCountSql }

  const userCount = await queryDB(pool, userCountQuery);

  if (userCount[0].userCount > 1) {
    const id = encodeURIComponent(req.params.id)

    const sql = `
      DELETE FROM wp_users WHERE ID=?
    `
    const values = [ id ]
    
    const queryObj = { sql, values }

    await queryDB(pool, queryObj)
      .then(data => {
        res.send({
          message: 'user deleted',
          data
        })
      })
      .catch(err => {
        res.send({
          error: 'user not deleted',
          err
        })
      })

  } else {
    res.send({
      error: 'trying to delete the last user'
    })
  }

})

module.exports = usersRoute;