const express = require('express');
const postsRoute = express.Router();

const pool = require('../utils/pool');
const { queryDB } = require('../utils/helpers');
const { 
  getPosts, 
  getPostById, 
  createNewPost,
  deletePostById ,
  updatePost
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
 * Update a post by ID
 * 
 */
// postsRoute.put('/:id', async (req, res) => {

//   const postTitle = req.body.data.postTitle
//   const postName = req.body.data.postName
//   const postContent = req.body.data.postContent
//   const id = req.params.id

//   const sql = `
//   UPDATE wp_posts
//     SET post_title=?,
//     post_name=?,
//     post_content=?,
//     post_modified=CURRENT_TIMESTAMP,
// 	  post_modified_gmt=UTC_TIMESTAMP
//     WHERE ID=?
//   `

//   const query = {
//     sql,
//     values: [ 
//       postTitle,
//       postName, 
//       postContent, 
//       id 
//     ]
//   }

//   await queryDB(pool, query)
//     .then(data => {
//       res.send({
//         success: true,
//         message: 'Post Updated',
//         data
//       })
//     })
//     .catch(err => {
//       console.log(err);
//       res.send({ 
//         success: false,
//         error: `error -> ${err}`
//        })
//     })
// })

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


postsRoute.put('/:id', async (req, res) => {
  console.log(JSON.stringify(req.params, null, '\t'), 'req.body')
  await updatePost(req)
    .then(data => {
      console.log(JSON.stringify(data, null, '\t'), 'data from route...')
      res.send({data})
    })
    .catch(err => {
      console.log(JSON.stringify(err, null, '\t'), 'err')
    })
})

postsRoute.post('/new', async (req, res) => {

  await createNewPost(req)
    .then(data => res.send({ data }))
    .catch(err => res.send({ error: err }))
})


module.exports = postsRoute