SELECT "Adding new services" AS "";

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'recommendation_type', 'GET', 0, 0 ),
( 'recommendation_type', 'GET', 1, 0 ),
( 'data_option', 'PATCH', 1, 1 ),
( 'data_option_category', 'PATCH', 1, 1 ),
( 'data_option_detail', 'DELETE', 1, 1 ),
( 'data_option_detail', 'PATCH', 1, 1 ),
( 'data_option_detail', 'POST', 0, 1 ),
( 'reqn_data_option', 'DELETE', 1, 0 ),
( 'reqn_data_option', 'GET', 0, 0 ),
( 'reqn_data_option', 'GET', 1, 0 ),
( 'reqn_data_option', 'POST', 0, 0 ),
( 'study_phase', 'GET', 0, 1 ),
( 'study_phase', 'GET', 1, 1 ),
( 'supplemental_file', 'DELETE', 1, 1 ),
( 'supplemental_file', 'GET', 0, 1 ),
( 'supplemental_file', 'GET', 1, 1 ),
( 'supplemental_file', 'PATCH', 1, 1 ),
( 'supplemental_file', 'POST', 0, 1 );

DELETE FROM service WHERE subject IN ( 'footnote', 'reqn_note' );
