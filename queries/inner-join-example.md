A quick example of selecting all the columns from `wp_terms` and a few from `wp_term_taxonomy`. 

The tables are joined where the `term_id`s match.

```
SELECT wp_terms.*, wp_term_taxonomy.taxonomy, wp_term_taxonomy.count FROM wp_terms
	INNER JOIN wp_term_taxonomy ON wp_terms.term_id = wp_term_taxonomy.term_id
```