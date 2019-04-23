This inserts meta data into `wp_postmeta` for featured images. I'm not entirely sure about the sub-query. it's a little unclear to me the best way to disambiguate these. using the `post_name` isn't too bad I think because it's timestamped.

```
INSERT INTO wp_postmeta (
  post_id,
  meta_key,
  meta_value
) VALUES (
  999,
  "_thumbnail_id",
  (
    SELECT ID FROM wp_posts WHERE post_name="name"
  )
)
```