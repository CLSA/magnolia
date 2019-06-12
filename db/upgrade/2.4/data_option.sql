SELECT "Moving Genomics to Biomarkers category" AS "";

UPDATE data_option
SET rank = 3,
    data_option_category_id = ( SELECT id FROM data_option_category WHERE name_en = "Biomarkers" )
WHERE name_en = "Genomics (N= ~26,800)";

SELECT "Adding new Epigenetics data-option" AS "";

INSERT IGNORE INTO data_option( data_option_category_id, rank, name_en, name_fr )
SELECT id, 4, "Epigenetics (N= ~1,488)", "Épigénétique (N= ~1,488)"
FROM data_option_category
WHERE name_en = "Biomarkers";
