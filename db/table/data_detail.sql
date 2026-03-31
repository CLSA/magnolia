CREATE TABLE data_detail (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  data_selection_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  name_en VARCHAR(127) NOT NULL,
  name_fr VARCHAR(127) NOT NULL,
  note_en TEXT NULL DEFAULT NULL,
  note_fr TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_data_selection_id_rank (data_selection_id ASC, rank ASC),
  INDEX fk_data_selection_id (data_selection_id ASC),
  CONSTRAINT fk_data_detail_data_selection_id
    FOREIGN KEY (data_selection_id)
    REFERENCES magnolia.data_selection (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
