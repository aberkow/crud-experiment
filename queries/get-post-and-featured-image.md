this query will get a post _and_ featured image by the post's ID.
it returns two rows. this is different from [getting just the featured image by id](./get-thumbnail-from-post-id.md)

```
SELECT * FROM wp_posts WHERE ID=476 OR ID=(
	SELECT meta_value FROM wp_postmeta 
		WHERE meta_key="_thumbnail_id" AND post_id=476
)
```

similarly, if you just need the post ID for the related featured image, use:

```
SELECT ID FROM wp_posts WHERE ID=(
	SELECT meta_value FROM wp_postmeta 
		WHERE meta_key="_thumbnail_id" AND post_id=476
)
```