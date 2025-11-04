SELECT 'Adding new services' AS '';

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'amendment', 'GET', 0, 0 ),
( 'amendment', 'GET', 1, 0 ),
( 'amendment', 'PATCH', 1, 1 ),
( 'user_ip_address', 'GET', 0, 0 ),
( 'user_ip_address', 'GET', 1, 0 );
