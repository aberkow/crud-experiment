```
SELECT wp_users.ID, wp_users.user_email, wp_users.display_name, wp_usermeta.meta_key, wp_usermeta.meta_value 
	FROM wp_users
		INNER JOIN wp_usermeta ON wp_users.ID = wp_usermeta.user_id
		WHERE meta_key="wp_capabilities" AND meta_value LIKE "%administrator%"
```

selects for users based on if they're admins. can be useful for checking current user capabilities.