const express = require('express');
const router = express.Router();
const imagesRoute = require('./imagesRoute')
const postsRoute = require('./postsRoute');
const usersRoute = require('./usersRoute');

// all routes under here will be part of the API.
router.get('/', (req, res) => {
  res.send({ message: 'api home' })
})

// routes under /api/posts
router.use('/images', imagesRoute)
router.use('/posts', postsRoute)
router.use('/users', usersRoute)

module.exports = router;