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

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' })
})

app.get('/admin', (req, res) => {
  res.render('admin/home', { title: 'Admin' })
})

app.get('/admin/posts', (req, res) => {

  axios.get('http://localhost:3000/api/posts')
    .then(data => {
      // res.render('')
      res.render('admin/posts', { 
        title: 'Posts',
        data 
      })
    })
    .catch(err => console.log(err))

})

// delegate API requests to specific routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});