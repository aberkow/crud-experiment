const express = require('express')
const postsRoute = express.Router()
const {
  getPosts,
  getPostById,
  createNewPost,
  deletePostById,
  updatePost
} = require('../controllers/postsController')

postsRoute.get('/', async (req, res) => {
  await getPosts(req)
    .then((data) => {
      res.render('admin/posts', {
        title: 'posts',
        data
      })
    })
    .catch(err => {
      res.render('admin/posts', {
        title: 'Posts',
        data: err
      })
    })
})

postsRoute.get('/new', async (req, res) => {
  await createNewPost(req)
    .then((data) => {
      res.render('admin/posts/single', {
        title: `Posts - ${data[0].post_title}`,
        singlePost: data[0]
      })
    })
    .catch(err => {
      res.render('admin/posts/single', {
        title: 'Posts - error',
        error: err
      })
    })
})

// get posts by ID on the admin side
postsRoute.get('/:id', async (req, res) => {

  await getPostById(req)
    .then((data) => {
      res.render('admin/posts/single', {
        title: `Posts - ${data[0].post_title}`,
        singlePost: data[0]
      })
    })
    .catch(err => {
      res.render('admin/posts/single', {
        title: `Posts - error`,
        error: err
      })
    })
})

postsRoute.post('/:id', async (req, res) => {
  // 
  console.log(JSON.stringify(req.body, null, '\t'), 'req.body')

  // untested...
  await updatePost(req)
    .then((data) => {
      res.send({ data })
    })
    .catch(err => err)

})

postsRoute.delete('/:id', async (req, res) => {
  await deletePostById(req)
    .then((data) => {
      res.send({ 
        message: 'deleted', 
        data: {
          isDeleted: true
        } 
      })
    })
    .catch(err => {
      res.send({
        err, 
        message: 'There was a problem deleting the post' 
      })
    })
})

module.exports = postsRoute