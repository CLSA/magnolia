SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'recommendation_type', 'GET', 0, 0 ),
( 'recommendation_type', 'GET', 1, 0 ),
( 'supplemental_file', 'DELETE', 1, 1 ),
( 'supplemental_file', 'GET', 0, 1 ),
( 'supplemental_file', 'GET', 1, 1 ),
( 'supplemental_file', 'PATCH', 1, 1 ),
( 'supplemental_file', 'POST', 0, 1 );
