SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'data_agreement', 'DELETE', 1, 1 ),
( 'data_agreement', 'GET', 0, 1 ),
( 'data_agreement', 'GET', 1, 1 ),
( 'data_agreement', 'PATCH', 1, 1 ),
( 'data_agreement', 'POST', 0, 1 ),
( 'coapplicant', 'PATCH', 1, 1 ),
( 'notation', 'DELETE', 1, 1 ),
( 'notation', 'PATCH', 1, 1 ),
( 'notation', 'POST', 0, 1 );
