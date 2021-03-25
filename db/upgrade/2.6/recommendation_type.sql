SELECT "Renaming recommendation type from 'Partially Feasible' to 'Unable to Assess'" AS "";

UPDATE recommendation_type SET name = "Unable to Assess" WHERE name = "Partially Feasible";
