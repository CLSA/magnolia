SELECT "Creating new data_option_has_footnote table" AS "";

CREATE TABLE IF NOT EXISTS data_option_has_footnote (
  data_option_id INT UNSIGNED NOT NULL,
  footnote_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (data_option_id, footnote_id),
  INDEX fk_footnote_id (footnote_id ASC),
  INDEX fk_data_option_id (data_option_id ASC),
  CONSTRAINT fk_data_option_has_footnote_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES data_option (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_data_option_has_footnote_footnote_id
    FOREIGN KEY (footnote_id)
    REFERENCES footnote (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT IGNORE INTO data_option_has_footnote( data_option_id, footnote_id )
SELECT data_option.id, footnote.id
FROM footnote, data_option
JOIN data_option_category ON data_option.data_option_category_id = data_option_category.id
WHERE (
  data_option_category.rank = 1
  AND data_option.rank = 7
  AND footnote.id = 6
) OR (
  data_option_category.rank = 2
  AND data_option.rank IN( 1, 3 )
  AND footnote.id = 8
) OR (
  data_option_category.rank = 2
  AND data_option.rank = 2
  AND footnote.id = 6
) OR (
  data_option_category.rank = 2
  AND data_option.rank = 4
  AND footnote.id = 17
) OR (
  data_option_category.rank = 4
  AND data_option.rank = 1
  AND footnote.id = 11
);
