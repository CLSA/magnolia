SELECT "Adding new Mortality Data data-category" AS "";

SELECT MAX(rank)+1 INTO @new_rank FROM data_category;
INSERT IGNORE INTO data_category( rank, comment, name_en, name_fr )
SELECT @new_rank, true, 'Mortality Data', 'Données sur la mortalité';
