const express = require('express');
const router = express.Router();

const pool = require('../utils/pool');
const { queryDB } = require('../utils/helpers');

// all routes under here will be part of the API.
router.get('/', (req, res) => {
  res.send({ message: 'api home' })
})


/**
 * 
 * GET posts with pagination
 * 
 */
router.get('/posts', async (req, res) => {
  const status = req.query.status || 'publish'
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const offset = (limit + 1) * (page - 1);
  const qs = `
    SELECT * FROM wp_posts 
      WHERE post_status LIKE "${status}" 
      LIMIT ${limit}
      OFFSET ${offset}
  `

  await queryDB(pool, qs)
    .then(results => res.send(results))
    .catch(err => {
      console.log(err);
      res.send({ error: err })
    })
})

/**
 * 
 * add a new post. ID is auto incremented
 * 
 */
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

/**
 * 
 * Update a post by ID
 * 
 */
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

/**
 * 
 * Delete a post by ID
 * 
 */
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