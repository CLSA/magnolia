CREATE TABLE data_option (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  data_category_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  cost_combined TINYINT(1) NOT NULL DEFAULT 0,
  justification TINYINT(1) NOT NULL DEFAULT 0,
  name_en VARCHAR(127) NOT NULL,
  name_fr VARCHAR(127) NOT NULL,
  condition_en TEXT NULL DEFAULT NULL,
  condition_fr TEXT NULL DEFAULT NULL,
  note_en TEXT NULL DEFAULT NULL,
  note_fr TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name_en (name_en ASC),
  UNIQUE INDEX uq_name_fr (name_fr ASC),
  UNIQUE INDEX uq_data_category_id_rank (data_category_id ASC, rank ASC),
  INDEX fk_data_category_id (data_category_id ASC),
  CONSTRAINT fk_data_option_data_category_id
    FOREIGN KEY (data_category_id)
    REFERENCES magnolia.data_category (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
