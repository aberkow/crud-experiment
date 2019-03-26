const express = require('express')
const postsRoute = express.Router()
const {
  getPosts,
  getPostById
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

module.exports = postsRoute