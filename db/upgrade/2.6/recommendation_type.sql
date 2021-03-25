SELECT "Renaming recommendation type from 'Partially Feasible' to 'Unable to Access'" AS "";

UPDATE recommendation_type SET name = "Unable to Access" WHERE name = "Partially Feasible";
