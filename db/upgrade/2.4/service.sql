SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'reqn_version', 'GET', 0, 0 ),
( 'reqn_version', 'GET', 1, 0 );

UPDATE service
SET subject = 'reqn_version_data_option'
WHERE subject = 'reqn_data_option';
