const express = require('express');
const router = express.Router();
const postsRoute = require('./postsRoute');

// all routes under here will be part of the API.
router.get('/', (req, res) => {
  res.send({ message: 'api home' })
})

// routes under /api/posts
router.use('/posts', postsRoute)

module.exports = router;