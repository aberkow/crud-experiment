const express = require('express');
const postsRoute = express.Router();

// const pool = require('../utils/pool');
// const { queryDB } = require('../utils/helpers');
const { 
  getPosts, 
  getPostById, 
  createNewPost,
  deletePostById ,
  updatePost,
  duplicatePost
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

postsRoute.post('/new', async (req, res) => {

  await createNewPost(req)
    .then(data => res.send({ data }))
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
 * Delete a post by ID
 * WP "deletes" a post from the db by first setting the status to "trash"
 * 
 */

postsRoute.delete('/:id', async (req, res) => {
  await deletePostById(req)
    .then(data => res.send({ data }))
    .catch(err => res.send({ error: err }))
})

/**
 *
 * Update a post by ID
 *
 */
postsRoute.put('/:id', async (req, res) => {
  await updatePost(req)
    .then((data) => {
      // only one post is returned from an update.
      // send back the data as an object not an object wrapped in an array.
      res.send({ data: data[0] })
    })
    .catch(err => {
      res.send({ error: err })
    })
})




module.exports = postsRoute