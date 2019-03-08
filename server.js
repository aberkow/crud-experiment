require('dotenv').config()

const express = require('express');
// const mysql = require('mysql');
const pool = require('./utils/pool');
const { queryDB } = require('./utils/helpers');


const app = express();

const PORT = process.env.PORT;

app.get('/', async (req, res) => {
  const qs = 'SELECT * FROM wp_posts WHERE post_status LIKE "publish"'
  const results = await queryDB(pool, qs)

  res.send(results)
})


app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});