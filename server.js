require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

const routes = require('./routes/routes');

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
app.use(bodyParser.json())
app.use(bodyParser({ extended: true }))

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' })
})

app.get('/admin', (req, res) => {
  res.render('admin/home', { title: 'Admin' })
})

// delegate API requests to specific routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});