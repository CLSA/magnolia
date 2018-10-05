SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'recommendation_type', 'GET', 0, 0 ),
( 'recommendation_type', 'GET', 1, 0 );
