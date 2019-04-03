wp stores information about featured images (maybe all images?) in two locations
- wp_posts: the image is stored as a "post" with a type of `attachment` and a mime-type of `image/{img-type}. it is assigned a unique ID
- wp_postmeta: the metadata and file string are stored here.

in wp_postmeta, there's also a cross reference to `_thumbnail_id` where the meta_value is the same as the ID of the image. the post_id for the `_thumbnail_id` is the same as the post it references.

So...

Let's say there's a post with an ID of 16 and it gets assigned an image that has an ID (in wp_posts) of 19

in wp_postmeta, the entries will look like the following.
|meta_id|post_id|meta_key                 |meta_value|
|-------|-------|-------------------------|-----------|
|26	    | 19	  |  _wp_attached_file	    | path/to/image.jpg
|27	    | 19	  |  _wp_attachment_metadata|// a serialized array of metadata
|30	    | 16	  |  _thumbnail_id	        | 19

to get all the correct meta data and path from the post, we need to match the post ID of 19 (the image) to the reference to the image on the post which is the meta_value with the same ID. this will use a nested select to get the meta_value of 19 based on the post ID of 16. the `AND` makes sure to filter based on only selecting thumbnails.

```
SELECT * FROM wp_postmeta
  WHERE wp_postmeta.post_ID=(
    SELECT wp_postmeta.meta_value
      FROM wp_postmeta
      WHERE wp_postmeta.meta_key="_thumbnail_id"
      AND wp_postmeta.post_id=16
  )
```

obviously to return just the values, use `SELECT meta_value` instead of the `*`