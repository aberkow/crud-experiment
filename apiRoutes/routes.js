const express = require('express');
const router = express.Router();
const attachmentsRoute = require('./attachmentsRoute')
const postsRoute = require('./postsRoute');
const usersRoute = require('./usersRoute');

// all routes under here will be part of the API.
router.get('/', (req, res) => {
  res.send({ message: 'api home' })
})

// routes under /api/posts
router.use('/attachments', attachmentsRoute)
router.use('/posts', postsRoute)
router.use('/users', usersRoute)

module.exports = router;