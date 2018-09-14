SELECT "Creating new data_option_detail_has_footnote table" AS "";

CREATE TABLE IF NOT EXISTS data_option_detail_has_footnote (
  data_option_detail_id INT UNSIGNED NOT NULL,
  footnote_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (data_option_detail_id, footnote_id),
  INDEX fk_footnote_id (footnote_id ASC),
  INDEX fk_data_option_detail_id (data_option_detail_id ASC),
  CONSTRAINT fk_data_option_detail_has_footnote_data_option_detail_id
    FOREIGN KEY (data_option_detail_id)
    REFERENCES data_option_detail (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_data_option_detail_has_footnote_footnote_id
    FOREIGN KEY (footnote_id)
    REFERENCES footnote (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT IGNORE INTO data_option_detail_has_footnote( data_option_detail_id, footnote_id )
SELECT data_option_detail.id, footnote.id
FROM footnote, data_option_detail
JOIN data_option ON data_option_detail.data_option_id = data_option.id
WHERE (
  data_option.name_en = "Socio-Demographic Characteristics"
  AND data_option_detail.rank = 6
  AND footnote.id = 1
) OR (
  data_option.name_en = "Lifestyle and Behaviour"
  AND data_option_detail.rank = 4
  AND footnote.id = 2
) OR (
  data_option.name_en = "Physical Health I"
  AND data_option_detail.rank = 2
  AND footnote.id = 3
) OR (
  data_option.name_en = "Physical Health I"
  AND data_option_detail.rank = 9
  AND footnote.id = 4
) OR (
  data_option.name_en = "Physical Health II"
  AND data_option_detail.rank = 1
  AND footnote.id = 5
) OR (
  data_option.name_en = "Physical Health II"
  AND data_option_detail.rank IN( 2, 3, 4, 5, 6, 7, 13, 14, 15, 16 )
  AND footnote.id = 2
) OR (
  data_option.name_en = "Physical Health II"
  AND data_option_detail.rank = 18
  AND footnote.id = 14
) OR (
  data_option.name_en = "Cognition - metadata & scores"
  AND data_option_detail.rank IN( 1, 2, 3, 4 )
  AND footnote.id = 6
) OR (
  data_option.name_en = "Labour Force"
  AND data_option_detail.rank IN( 3, 4 )
  AND footnote.id = 7
) OR (
  data_option.name_en = "Bio-Impedance by DEXA"
  AND data_option_detail.rank = 1
  AND footnote.id = 6
) OR (
  data_option.name_en = "Physical Assessments II"
  AND data_option_detail.rank IN( 6 )
  AND footnote.id = 9
) OR (
  data_option.name_en = "Physical Assessments II"
  AND data_option_detail.rank = 4
  AND footnote.id = 6
) OR (
  data_option.name_en = "Physical Assessments II"
  AND data_option_detail.rank = 6
  AND footnote.id = 10
) OR (
  data_option.name_en = "Physical Assessments II"
  AND data_option_detail.rank = 5
  AND footnote.id = 15
) OR (
  data_option.name_en = "Physical Assessments II"
  AND data_option_detail.rank = 1
  AND footnote.id = 16
) OR (
  data_option.name_en = "Air Quality"
  AND data_option_detail.rank IN( 2, 3 )
  AND footnote.id = 13
) OR (
  data_option.name_en = "Neighborhood Factors"
  AND data_option_detail.rank IN( 1, 2, 3 )
  AND footnote.id = 13
) OR (
  data_option.name_en = "Greenness & Weather"
  AND data_option_detail.rank IN( 1, 2 )
  AND footnote.id = 13
);
