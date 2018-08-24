SELECT "Creating new data_option_category_has_footnote table" AS "";

CREATE TABLE IF NOT EXISTS data_option_category_has_footnote (
  data_option_category_id INT UNSIGNED NOT NULL,
  footnote_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (data_option_category_id, footnote_id),
  INDEX fk_footnote_id (footnote_id ASC),
  INDEX fk_data_option_category_id (data_option_category_id ASC),
  CONSTRAINT fk_data_option_category_has_footnote_data_option_category_id
    FOREIGN KEY (data_option_category_id)
    REFERENCES data_option_category (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_data_option_category_has_footnote_footnote_id
    FOREIGN KEY (footnote_id)
    REFERENCES footnote (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT IGNORE INTO data_option_category_has_footnote( data_option_category_id, footnote_id )
SELECT data_option_category.id, footnote.id
FROM data_option_category, footnote
WHERE (
  data_option_category.rank = 4
  AND footnote.id = 12
) OR (
  data_option_category.rank = 5
  AND footnote.id IN( 13, 1 )
);
