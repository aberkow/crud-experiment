const express = require('express')
const imagesRoute = express.Router()

const upload = require('../utils/upload')

const { 
  getPostFeaturedImageByID,
  createPostFeaturedImage
 } = require('../controllers/imagesController')

 /**
  * 
  * Get a featured image by its parent post's ID
  * 
  */
imagesRoute.get('/:id', async (req, res) => {
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
imagesRoute.post('/:id', upload.single('attachment'), async (req, res) => {
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

module.exports = imagesRoute

