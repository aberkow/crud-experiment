const express = require('express');
const usersRoute = express.Router();

const php = require('js-php-serialize')

const pool = require('../utils/pool')
const { queryDB } = require('../utils/helpers')

usersRoute.get('/', async (req, res) => {
  const sql = ``;

  const query = {
    sql,
    values: []
  }

  await queryDB(pool, query)
    .then(results => res.send(results))
    .catch(err => {
      console.log(err);
      res.send({ error: err })
    })
})

usersRoute.post('/new', async (req, res) => {
  const sql = `
  INSERT INTO wp_usermeta (
		user_id,
		meta_key,
		meta_value
	) VALUES (
		1,
		'test',
		?
	);`

  const test = php.serialize({ 
    attack: encodeURIComponent('</script>')
  })

  console.log(JSON.stringify(test, null, '\t'), 'test')

  const values = [ test ]  


  const query = {
    sql,
    values
  }

  await queryDB(pool, query)
    .then(results => res.send(results))
    .catch(err => {
      console.log(err);
      res.send({ error: err })
    })
})

module.exports = usersRoute;