SELECT "Removing write access to report_restriction services" AS "";

DELETE FROM service WHERE subject = "report_restriction" and method != "GET";

SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'graduate', 'DELETE', 1, 1 ),
( 'graduate', 'GET', 0, 1 ),
( 'graduate', 'GET', 1, 1 ),
( 'graduate', 'PATCH', 1, 1 ),
( 'graduate', 'POST', 0, 1 ),
( 'reqn_type', 'GET', 0, 0 ),
( 'reqn_type', 'GET', 1, 0 ),
( 'reqn_version', 'GET', 0, 0 ),
( 'reqn_version', 'GET', 1, 0 ),
( 'reqn_version', 'PATCH', 1, 1 );

UPDATE service
SET subject = 'reqn_version_data_option'
WHERE subject = 'reqn_data_option';
