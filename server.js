require('dotenv').config()

const express = require('express');

const routes = require('./routes/routes');

const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('home page')
})

// delegate API requests to specific routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});