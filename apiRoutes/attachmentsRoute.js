const express = require('express')
const attachmentsRoute = express.Router()

const upload = require('../utils/upload')

const { 
  getPostFeaturedImageByID,
  createPostFeaturedImage
 } = require('../controllers/attachmentsController')

 const { getPosts } = require('../controllers/postsController')




/** 
 * 
 * Attachments (e.g. images) are stored as posts.
 * Therefor it's not necessary to create a new controller for them
 * The getPosts function from the posts controller can be used instead
 * The status and type are defined from the beginning
 * This prevents them from being overridden by other queries
 * 
*/
attachmentsRoute.get('/', async (req, res) => {

  Object.assign(req, {
    query: {
      status: 'inherit',
      type: 'attachment'
    }
  })

  await getPosts(req)
    .then(data => {
      console.log(data, 'data');
      res.send({ data })
    })
    .catch(err => {
      console.log(err, 'err');
      res.send({ error: err })
    })

})



 /**
  * 
  * Get a featured image by its parent post's ID
  * 
  */
attachmentsRoute.get('/:id', async (req, res) => {
  await getPostFeaturedImageByID(req)
    .then(data => {
      // console.log(data, 'data')
      res.send({ data })
    })
    .catch(err => {
      console.log(err, 'err');
      res.send({ error: err })
    })
})

/**
 * 
 * Attach a featured image to a parent post by the parent's ID
 * 
 */
attachmentsRoute.post('/:id', upload.single('attachment'), async (req, res) => {
  await createPostFeaturedImage(req)
    .then(data => {
      console.log(data);
      res.send({ data })
    })
    .catch(err => {
      console.log(err, 'err');
      res.send({ error: err })
    })
})

module.exports = attachmentsRoute

