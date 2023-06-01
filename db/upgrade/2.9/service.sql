SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'additional_fee', 'DELETE', 1, 1 ),
( 'additional_fee', 'GET', 0, 1 ),
( 'additional_fee', 'GET', 1, 1 ),
( 'additional_fee', 'PATCH', 1, 1 ),
( 'additional_fee', 'POST', 0, 1 ),
( 'packaged_data', 'GET', 0, 1 );
