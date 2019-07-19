SELECT "Removing write access to report_restriction services" AS "";

DELETE FROM service WHERE subject = "report_restriction" and method != "GET";

SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'amendment_type', 'DELETE', 1, 1 ),
( 'amendment_type', 'GET', 0, 0 ),
( 'amendment_type', 'GET', 1, 1 ),
( 'amendment_type', 'PATCH', 1, 1 ),
( 'amendment_type', 'POST', 0, 1 ),
( 'data_version', 'DELETE', 1, 1 ),
( 'data_version', 'GET', 0, 1 ),
( 'data_version', 'GET', 1, 1 ),
( 'data_version', 'PATCH', 1, 1 ),
( 'data_version', 'POST', 0, 1 ),
( 'data_release', 'DELETE', 1, 1 ),
( 'data_release', 'GET', 0, 1 ),
( 'data_release', 'GET', 1, 1 ),
( 'data_release', 'PATCH', 1, 1 ),
( 'data_release', 'POST', 0, 1 ),
( 'graduate', 'DELETE', 1, 1 ),
( 'graduate', 'GET', 0, 1 ),
( 'graduate', 'GET', 1, 1 ),
( 'graduate', 'PATCH', 1, 1 ),
( 'graduate', 'POST', 0, 1 ),
( 'notice', 'DELETE', 1, 1 ),
( 'notice', 'GET', 0, 0 ),
( 'notice', 'GET', 1, 0 ),
( 'notice', 'PATCH', 1, 1 ),
( 'notice', 'POST', 0, 1 ),
( 'reqn_type', 'GET', 0, 0 ),
( 'reqn_type', 'GET', 1, 0 ),
( 'reqn_type', 'PATCH', 1, 1 ),
( 'reqn_version', 'GET', 0, 0 ),
( 'reqn_version', 'GET', 1, 0 ),
( 'reqn_version', 'PATCH', 1, 1 ),
( 'review_type', 'GET', 0, 1 ),
( 'review_type', 'GET', 1, 1 ),
( 'review_type', 'PATCH', 1, 1 );

UPDATE service
SET subject = 'reqn_version_data_option'
WHERE subject = 'reqn_data_option';
