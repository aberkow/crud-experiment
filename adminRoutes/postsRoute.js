const express = require('express')
const postsRoute = express.Router()
const {
  getPosts,
  getPostById,
  createPost
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

postsRoute.get('/new', async (req, res) => {

  // await createPost(req)
  //   .then(({ data }) => res.send({data}))
  //   .catch(err => res.send({ error: err }))


  // res.render('admin/posts/single', {
  //   title: 'test',
  //   // singlePost: {}
  // })
  await createPost(req)
    .then(({ data }) => {
      console.log(JSON.stringify(data, null, '\t'), 'data')
      res.render('admin/posts/single', {
        title: `New Post with ID`,
        singlePost: data[0]
      })
    })
    .catch(err => {
      console.log(JSON.stringify(err, null, '\t'), 'err')
      res.render('admin/posts/single', {
        title: `New Post Error`,
        error: err
      })
    })
})

module.exports = postsRoute