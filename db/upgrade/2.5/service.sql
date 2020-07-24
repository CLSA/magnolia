SELECT "Replacing 'graduate' services with 'applicant' services" AS "";

UPDATE service SET subject = "applicant" WHERE subject = "graduate";

SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'publication', 'DELETE', 1, 1 ),
( 'publication', 'GET', 0, 0 ),
( 'publication', 'GET', 1, 0 ),
( 'publication', 'PATCH', 1, 1 ),
( 'publication', 'POST', 0, 1 );
