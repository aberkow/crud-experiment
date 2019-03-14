const express = require('express');
const usersRoute = express.Router();

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

  const values = [
    {
      item: 'test'
    }
  ]  


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