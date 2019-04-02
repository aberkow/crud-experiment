const express = require('express')
const imagesRoute = express.Router()

const { 
  getPostFeaturedImageByID
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

module.exports = imagesRoute

