require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const axios = require('axios');

const routes = require('./routes/routes');
const { queryDB } = require('./utils/helpers');

const app = express();

const PORT = process.env.PORT;

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: `${__dirname}/views/layouts/`,
  partialsDir: `${__dirname}/views/partials`
}))

app.set('view engine', 'hbs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// delegate API requests to specific routes
app.use('/api', routes);

// create a local axios instance just for querying the API
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
})

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' })
})

app.get('/admin', (req, res) => {
  res.render('admin/home', { title: 'Admin' })
})

app.get('/admin/posts', (req, res) => {

  instance.get('posts')
    .then(({ data }) => {
      
      res.render('admin/posts', { 
        title: 'Posts',
        data 
      })
    })
    .catch(err => console.log(err))

})

app.get('/admin/posts/:id', (req, res) => {
  instance.get(`posts/${req.params.id}`)
    .then(({ data }) => {
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

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});