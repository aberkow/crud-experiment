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
    .then(results, res.send(results))
    .catch(err => {
      console.log(err);
      res.send({ error: err })
    })
})