When updating a post, wp updates the post with the current ID. but it also creates a new row with almost all the same content as a revision. The `post_status` on the new row is changed to `inherit`. The post name is changed to `ID-revision-v1`. This is in addition to any other timestamp updates. What's cool here is that it can be done in one step. Because the post ID of the original post is known and `wp_posts.ID` is auto-incremented, you don't have to insert the post and then update it as in the [insert example](./insert-into-row.md)

```
# create a variable of the post's ID
SELECT @ID = 515;

INSERT INTO wp_posts
	(
		post_author, 
		post_date,
		post_date_gmt,
		post_content,
		post_title,
		post_excerpt,
		post_status,
		comment_status,
		ping_status,
		post_password,
		post_name,
		to_ping,
		pinged,
		post_modified,
		post_modified_gmt,
		post_content_filtered,
		post_parent,
		guid,
		menu_order,
		post_type,
		post_mime_type,
		comment_count
	)
	SELECT post_author, 
		post_date,
		post_date_gmt,
		post_content,
		"This is a test",
		post_excerpt,
		"inherit",
		comment_status,
		ping_status,
		post_password,
		CONCAT(@ID, "-revision-v1"),
		to_ping,
		pinged,
		post_modified,
		post_modified_gmt,
		post_content_filtered,
		@ID,
		guid,
		menu_order,
		post_type,
		post_mime_type,
		comment_count FROM wp_posts
	WHERE wp_posts.ID = @ID
```