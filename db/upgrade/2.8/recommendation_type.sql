SELECT "Converting 'Revise' recommendation type to 'Revise - minor' and 'Revise - major'" AS "";

UPDATE recommendation_type SET name = "Revise - major" WHERE name = "Revise";
INSERT IGNORE INTO recommendation_type SET name = "Revise - minor";
