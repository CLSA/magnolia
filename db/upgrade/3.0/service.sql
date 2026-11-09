SELECT 'Adding new services' AS '';

INSERT IGNORE INTO service ( subject, method, resource, restricted ) VALUES
( 'data_category_study_phase', 'DELETE', 1, 1 ),
( 'data_category_study_phase', 'GET', 0, 0 ),
( 'data_category_study_phase', 'GET', 1, 0 ),
( 'data_category_study_phase', 'PATCH', 1, 1 ),
( 'data_category_study_phase', 'POST', 0, 1 );
