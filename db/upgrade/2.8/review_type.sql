SELECT "Renaming SMT to EC in review type records" AS "";

UPDATE review_type SET name = "EC" WHERE name = "SMT";
UPDATE review_type SET name = "Second EC" WHERE name = "Second SMT";
