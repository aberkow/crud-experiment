```
SELECT wp_users.ID, wp_users.display_name, wp_usermeta.`meta_key`, wp_usermeta.meta_value FROM wp_users
	LEFT JOIN wp_usermeta ON wp_users.ID = wp_usermeta.user_id	
	WHERE wp_usermeta.meta_key="wp_capabilities" OR wp_usermeta.meta_key="wp_2_capabilities"
	ORDER BY wp_users.ID ASC
```