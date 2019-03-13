const express = require('express');
const postsRoute = express.Router();

const pool = require('../utils/pool');
const { getTimeZoneOffset, queryDB } = require('../utils/helpers');

/**
 * 
 * GET posts with pagination
 * 
 */
postsRoute.get('/', async (req, res) => {
  const status = req.query.status || 'publish'
  const type = req.query.post_type || 'post'
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const offset = (limit + 1) * (page - 1);

  const sql = `
    SELECT * FROM wp_posts 
      WHERE post_status LIKE ?
      AND post_type LIKE ?
      LIMIT ?
      OFFSET ?
  `

  const query = {
    sql,
    values: [status, type, limit, offset]
  }

  const timeZoneOffset = await getTimeZoneOffset(pool)

  await queryDB(pool, query)
    .then(results => res.send(results))
    .catch(err => {
      console.log(err);
      res.send({ error: err })
    })
})

/**
 * 
 * add a new post. ID is auto incremented
 * 
 */
postsRoute.post('/', async (req, res) => {
  const qs = `INSERT INTO wp_posts (
	post_author,
	post_date,
	post_date_gmt,
	post_content,
	post_title,
	post_excerpt,
	post_status,
	comment_status,
	ping_status,
	post_name,
	to_ping,
	pinged,
	post_modified,
	post_modified_gmt,
	post_content_filtered,
	post_parent,
	post_type
) VALUES (
	1,
	CURRENT_TIMESTAMP,
	UTC_TIMESTAMP,
	'this is the post content',
	'Hello World!',
	'an excerpt',
	'publish',
	'closed',
	'closed',
	'hello-world',
	'',
	'',
	CURRENT_TIMESTAMP,
	UTC_TIMESTAMP,
	'',
	0,
	'post'
);`
  await queryDB(pool, qs)
    .then(data => {
      res.send({
        message: 'New Post Added',
        data
      })
    })
    .catch(err => {
      console.log(err);
      res.send({ error: `error -> ${err}` })
    })
})

/**
 * 
 * Update a post by ID
 * 
 */
postsRoute.put('/:id', async (req, res) => {

  const id = req.params.id

  const sql = `
  UPDATE wp_posts
    SET post_title="Updated Post",
    post_modified=CURRENT_TIMESTAMP,
	  post_modified_gmt=UTC_TIMESTAMP
    WHERE ID=?
  `

  const query = {
    sql,
    values: [id]
  }

  await queryDB(pool, query)
    .then(data => {
      res.send({
        message: 'Post Updated',
        data
      })
    })
    .catch(err => {
      console.log(err);
      res.send({ error: `error -> ${err}` })
    })
})

/**
 * 
 * Delete a post by ID
 * WP "deletes" a post from the db by first setting the status to "trash"
 * 
 */
postsRoute.delete('/:id', async (req, res) => {

  const id = req.params.id;

  const sql = `UPDATE wp_posts 
    SET post_status="trash" 
    WHERE ID=?`

  const query = {
    sql,
    values: [id]
  }

  await queryDB(pool, query)
    .then(data => {
      res.send({
        message: 'Post Deleted',
        data
      })
    })
    .catch(err => {
      console.log(err);
      res.send({ error: `error -> ${err}` })
    })
})


postsRoute.post('/new', async (req, res) => {
  const isSecure = req.secure;
  const host = req.headers.host;
  const url = req.originalUrl;

  console.log(isSecure, host, url, 'test');

  // const qs = `INSERT INTO wp_posts (
  //   post_author,
  //   post_date,
  //   post_date_gmt,
  //   post_content,
  //   post_title,
  //   post_excerpt,
  //   post_status,
  //   comment_status,
  //   ping_status,
  //   post_name,
  //   to_ping,
  //   pinged,
  //   post_modified,
  //   post_modified_gmt,
  //   post_content_filtered,
  //   post_parent,
  //   guid,
  //   menu_order,
  //   post_type,
  //   post_mime_type,
  //   comment_count
  // ) VALUES (
  //   1
  //   CURRENT_TIMESTAMP,
  //   '0000-00-00 00:00:00',
  //   '',
  //   'Auto Draft',
  //   '',
  //   'auto-draft',
  //   'open',
  //   'open',
  //   '',
  //   '',
  //   '',
  //   CURRENT_TIMESTAMP,
  //   '0000-00-00 00:00:00',
  //   '',
  //   0,
  //   '',
  //   0,
  //   'post',
  //   '',
  //   0
  // )`;
})


module.exports = postsRoute