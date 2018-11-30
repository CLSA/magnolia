SELECT "Adding new footnotes to data_option_category records" AS "";

INSERT IGNORE INTO data_option_category_has_footnote( data_option_category_id, footnote_id )
SELECT data_option_category.id, footnote.id
FROM data_option_category, footnote
WHERE data_option_category.name_en = "Linked Data"
AND footnote.note_en LIKE "For a detailed list of the linked variables %";
