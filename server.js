require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

const routes = require('./routes/routes');
const { getPosts, getPostByName } = require('./controllers/postsController')

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

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' })
})

app.get('/posts', async (req, res) => {

  // prevent people from seeing un-published posts on the public side.
  req.query.status = 'publish'

  await getPosts(req)
    .then(data => {
      res.render('posts', {
        title: 'Posts',
        data
      })
    })
    .catch(err => {
      res.render('posts', {
        title: 'Posts',
        err
      })
    })

})

app.get('/posts/:name', async (req, res) => {
  await getPostByName(req)
    .then(data => {
      res.render('single', {
        title: data[0].post_title,
        singlePost: data[0]
      })
    })
    .catch(err => res.render('single', {
      title: 'Error',
      err
    }))
})

app.get('/admin', (req, res) => {
  res.render('admin/home', { title: 'Admin' })
})

app.get('/admin/posts', async (req, res) => {
  await getPosts(req)
    .then((results) => {
      console.log(results)
      
        res.render('admin/posts', {
          title: 'posts',
          data
        })
    })

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