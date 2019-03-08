To update a row
- identify the table to update
- set the updated value to a column
- where something matches a test.

```
UPDATE table_name 
  SET column_name=updated_value 
  WHERE column_name=current_value
```

```
UPDATE wp_posts 
  SET post_title="Updated Post" 
  WHERE ID=490
```