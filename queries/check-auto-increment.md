
check if a row auto increments

```mysql
SELECT *
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'table_name'
	AND COLUMN_NAME = 'row_name'
	AND DATA_TYPE LIKE '%int%'
	AND COLUMN_DEFAULT IS NULL
	AND IS_NULLABLE = 'NO'
	AND EXTRA LIKE '%auto_increment%'
```