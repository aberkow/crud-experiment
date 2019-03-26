const express = require('express')
const router = express.Router()
const postsRoute = require('./postsRoute')

router.get('/', (req, res) => {
  res.render('admin/home', { title: 'Admin' })
})

router.use('/posts', postsRoute);

module.exports = router