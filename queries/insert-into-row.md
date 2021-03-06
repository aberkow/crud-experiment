insert values into a row

```mysql
INSERT INTO table_name (
  column_1
  column_2
  ...
) VALUES (
  value_1
  value_2
  ...
)
```

```mysql
INSERT INTO wp_posts (
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
	CURRENT_TIMESTAMP,
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
	CURRENT_TIMESTAMP,
	'',
	0,
	'post'
);
```

```
--- insert the post
INSERT INTO wp_posts (
	--- other params
	guid
) VALUES (
	--- other vals
	'http://test.com?p='
);

--- immediately change the guid
UPDATE wp_posts
	SET guid=CONCAT(guid, LAST_INSERT_ID())
	WHERE ID=LAST_INSERT_ID();

--- show that it's updated
SELECT guid FROM wp_posts WHERE ID=LAST_INSERT_ID();
```
