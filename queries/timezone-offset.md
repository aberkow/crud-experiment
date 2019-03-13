It can be useful to know the timezone offsets stored in the db. these are needed when setting (for example) the created vs gmt created times on an entry.


```mysql
SELECT option_name, option_value FROM wp_options
          WHERE option_name="gmt_offset"
            OR option_name="timezone_string"
```

```js
const getTimeZoneOffset = async (pool) => {
  let result;
  try {
    const sql = `
      SELECT option_name, option_value FROM wp_options
        WHERE option_name="gmt_offset"
          OR option_name="timezone_string"
    `
    const queryObj = { sql }
    result = await pool.query(queryObj)
    return result;
  } catch (error) {
    throw new Error(`queryDB error -> ${error}`)
  }
}

const tzoffset = await getTimeZoneOffset(pool)

/*
tzoffset will be something like...

[
  {
    "option_name": "gmt_offset",
    "option_value": "0"
  },
  {
    "option_name": "timezone_string",
    "option_value": "{timezone string}"
  }
]

*/
```