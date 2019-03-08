require('dotenv').config()

const express = require('express');
const mysql = require('mysql');

const app = express();

const PORT = process.env.PORT;

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

connection.connect();

app.get('/', (req, res) => {

  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw new Error(`mysql err ${error}`)

    console.log(JSON.stringify(results, null, '\t'), 'results')

    console.log(JSON.stringify(fields, null, '\t'), 'fields')

    console.log('the solution is ', results[0].solution);

    connection.end()
  })

  res.send('hello world')
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});