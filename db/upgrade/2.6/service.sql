SELECT "Replacing 'graduate' services with 'applicant' services" AS "";

UPDATE service SET subject = "applicant" WHERE subject = "graduate";

SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'ethics_approval', 'DELETE', 1, 1 ),
( 'ethics_approval', 'GET', 0, 0 ),
( 'ethics_approval', 'GET', 1, 0 ),
( 'ethics_approval', 'PATCH', 1, 1 ),
( 'ethics_approval', 'POST', 0, 1 ),
( 'output_source', 'DELETE', 1, 1 ),
( 'output_source', 'GET', 0, 0 ),
( 'output_source', 'GET', 1, 0 ),
( 'output_source', 'PATCH', 1, 1 ),
( 'output_source', 'POST', 0, 1 ),
( 'output_type', 'DELETE', 1, 1 ),
( 'output_type', 'GET', 0, 0 ),
( 'output_type', 'GET', 1, 0 ),
( 'output_type', 'PATCH', 1, 1 ),
( 'output_type', 'POST', 0, 1 ),
( 'pdf_form', 'DELETE', 1, 1 ),
( 'pdf_form', 'PATCH', 1, 1 ),
( 'pdf_form', 'POST', 0, 1 ),
( 'region', 'GET', 0, 0 ),
( 'region', 'GET', 1, 0 ),
( 'reqn_version_justification', 'DELETE', 1, 0 ),
( 'reqn_version_justification', 'GET', 0, 0 ),
( 'reqn_version_justification', 'GET', 1, 0 ),
( 'reqn_version_justification', 'PATCH', 1, 0 ),
( 'reqn_version_justification', 'POST', 0, 0 );

SELECT "Renaming production services to output" AS "";
UPDATE service SET subject = "output" WHERE subject = "production";

SELECT "Removing production_type services" AS "";
DELETE FROM service WHERE subject = "production_type";
