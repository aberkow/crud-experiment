const express = require('express');
const router = express.Router();

const pool = require('../utils/pool');
const { queryDB } = require('../utils/helpers');

router.get('/', (req, res) => {
  res.send({ message: 'api home' })
})

router.get('/posts', async (req, res) => {
  const qs = 'SELECT * FROM wp_posts WHERE post_status LIKE "publish" LIMIT 10'
  const results = await queryDB(pool, qs)

  res.send(results)
})

router.post('/posts', async (req, res) => {
  const qs = `INSERT INTO wp_posts (
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
	post_type
) VALUES (
	1,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	'this is the post content',
	'Hello World!',
	'an excerpt',
	'publish',
	'closed',
	'closed',
	'hello-world',
	'',
	'',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	'',
	0,
	'post'
);`
  await queryDB(pool, qs)
    .then(data => {
      res.send({ 
        message: 'New Post Added',
        data 
      })
    })
    .catch(err => {
      console.log(err);
      res.send({ error: `error -> ${err}` })
    })
})

router.put('/posts/:id', async (req, res) => {

  const qs = `
  UPDATE wp_posts 
    SET post_title="Updated Post" 
    WHERE ID=${req.params.id}
  `
  await queryDB(pool, qs)
    .then(data => {
      res.send({
        message: 'Post Updated',
        data
      })
    })
    .catch(err => {
      console.log(err);
      res.send({ error: `error -> ${err}` })
    })
})

router.delete('/posts/:id', async (req, res) => {
  const qs = `DELETE FROM wp_posts WHERE ID=${req.params.id}`;

  await queryDB(pool, qs)
    .then(data => {
      res.send({
        message: 'Post Deleted',
        data
      })
    })
    .catch(err => {
      console.log(err);
      res.send({ error: `error -> ${err}` })
    })
})

module.exports = router;