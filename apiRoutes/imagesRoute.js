const express = require('express')
const imagesRoute = express.Router()

const upload = require('../utils/upload')

const { 
  getPostFeaturedImageByID,
  createPostFeaturedImage
 } = require('../controllers/imagesController')

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

imagesRoute.post('/:id', upload.single('image'), async (req, res) => {
  const { file, body } = req
  console.log({ file, body }, 'req???');
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

