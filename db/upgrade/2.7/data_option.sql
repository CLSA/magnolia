SELECT "Adding new cognition data-option" AS "";

INSERT IGNORE INTO data_option( data_option_category_id, rank, justification, name_en, name_fr )
SELECT data_option_category.id, 7, "Cognition (Raw data)", true, "Cognition (données brutes)"
FROM data_option_category
WHERE name_en = "Additional Data";
