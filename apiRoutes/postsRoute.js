const express = require('express');
const postsRoute = express.Router();

const pool = require('../utils/pool');
const { queryDB } = require('../utils/helpers');
const { 
  getPosts, 
  getPostById, 
  createPost,
  deletePostById 
} = require('../controllers/postsController')

/**
 * 
 * GET posts with pagination
 * 
 */
postsRoute.get('/', async (req, res) => {
  await getPosts(req)
    .then(data => res.send(data))
    .catch(err => res.send({ error: err }))
})

/**
 * 
 * GET a single post by its ID
 * 
 */
postsRoute.get('/:id', async (req, res) => {
  await getPostById(req)
    .then(data => res.send(data))
    .catch(err => res.send({ error: err }))
})

/**
 * 
 * add a new post. ID is auto incremented
 * 
 */
postsRoute.post('/', async (req, res) => {
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
	UTC_TIMESTAMP,
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
	UTC_TIMESTAMP,
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
postsRoute.put('/:id', async (req, res) => {

  const postTitle = req.body.data.postTitle
  const postName = req.body.data.postName
  const postContent = req.body.data.postContent
  const id = req.params.id

  const sql = `
  UPDATE wp_posts
    SET post_title=?,
    post_name=?,
    post_content=?,
    post_modified=CURRENT_TIMESTAMP,
	  post_modified_gmt=UTC_TIMESTAMP
    WHERE ID=?
  `

  const query = {
    sql,
    values: [ 
      postTitle,
      postName, 
      postContent, 
      id 
    ]
  }

  await queryDB(pool, query)
    .then(data => {
      res.send({
        success: true,
        message: 'Post Updated',
        data
      })
    })
    .catch(err => {
      console.log(err);
      res.send({ 
        success: false,
        error: `error -> ${err}`
       })
    })
})

/**
 * 
 * Delete a post by ID
 * WP "deletes" a post from the db by first setting the status to "trash"
 * 
 */

postsRoute.delete('/:id', async (req, res) => {
  await deletePostById(req)
    .then(data => res.send({ data }))
    .catch(err => res.send({ error: err }))
})


postsRoute.post('/new', async (req, res) => {

  await createPost(req)
    .then(data => res.send({ data }))
    .catch(err => res.send({ error: err }))
})


module.exports = postsRoute