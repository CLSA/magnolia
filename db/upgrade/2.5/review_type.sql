SELECT "Renaming 'SAC' review type to 'Feasibility'" AS "";

UPDATE review_type
SET name = "Feasibility"
WHERE name = "SAC";
