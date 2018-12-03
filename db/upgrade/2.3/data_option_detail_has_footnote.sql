SELECT "Adding new footnotes to data_option_detail records" AS "";

INSERT IGNORE INTO data_option_detail_has_footnote( data_option_detail_id, footnote_id )
SELECT data_option_detail.id, footnote.id
FROM data_option_detail, footnote
WHERE data_option_detail.name_en LIKE "%(CCT/CCC)"
AND footnote.note_en = "Self-reported Chronic Condition";

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Bio-Impedance by DEXA";

INSERT IGNORE INTO data_option_detail_has_footnote( data_option_detail_id, footnote_id )
SELECT data_option_detail.id, footnote.id
FROM data_option_detail, footnote
WHERE data_option_detail.data_option_id = @data_option_id
AND (
  footnote.note_en = "Bio-Impedance by DEXA." OR
  footnote.note_en LIKE "Raw data are available %"
)
ORDER BY footnote.note_en;

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Bone Density by DEXA";

INSERT IGNORE INTO data_option_detail_has_footnote( data_option_detail_id, footnote_id )
SELECT data_option_detail.id, footnote.id
FROM data_option_detail, footnote
WHERE data_option_detail.data_option_id = @data_option_id
AND (
  footnote.note_en = "Bone Density by DEXA." OR
  footnote.note_en LIKE "Images and raw data are available %"
)
ORDER BY footnote.note_en;

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Physical Health II";

INSERT IGNORE INTO data_option_detail_has_footnote( data_option_detail_id, footnote_id )
SELECT data_option_detail.id, footnote.id
FROM data_option_detail, footnote
WHERE data_option_detail.data_option_id = @data_option_id
AND data_option_detail.name_en NOT LIKE "Medication%"
AND footnote.note_en LIKE "Disease Algorithms and Disease Symptoms - %";

DELETE FROM data_option_detail_has_footnote
WHERE data_option_detail_id = ( SELECT id FROM data_option_detail where name_en = "Medications (MEDI; not yet available)" );
