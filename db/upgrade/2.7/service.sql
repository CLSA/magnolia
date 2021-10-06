SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'amendment_justification', 'DELETE', 1, 0 ),
( 'amendment_justification', 'GET', 0, 0 ),
( 'amendment_justification', 'GET', 1, 0 ),
( 'amendment_justification', 'PATCH', 1, 0 ),
( 'amendment_justification', 'POST', 0, 0 ),
( 'data_selection', 'DELETE', 1, 1 ),
( 'data_selection', 'GET', 0, 0 ),
( 'data_selection', 'GET', 1, 0 ),
( 'data_selection', 'PATCH', 1, 1 ),
( 'data_selection', 'POST', 0, 1 ),
( 'debug', 'POST', 0, 0 ),
( 'review_type_question', 'DELETE', 1, 1 ),
( 'review_type_question', 'GET', 0, 1 ),
( 'review_type_question', 'GET', 1, 1 ),
( 'review_type_question', 'PATCH', 1, 1 ),
( 'review_type_question', 'POST', 0, 1 ),
( 'review_answer', 'GET', 0, 1 ),
( 'review_answer', 'GET', 1, 1 ),
( 'review_answer', 'PATCH', 1, 1 );

SELECT "Renaming data_option_category services to data_category" AS "";
UPDATE service SET subject = "data_category" WHERE subject = "data_option_category";

SELECT "Renaming reqn_version_justification services to data_justification" AS "";
UPDATE service SET subject = "data_justification" WHERE subject IN( "reqn_version_justification", "data_option_justification" );

SELECT "Renaming data_option_detail services to data_detail" AS "";
UPDATE service SET subject = "data_detail" WHERE subject IN( "data_option_detail", "data_selection_detail" );
