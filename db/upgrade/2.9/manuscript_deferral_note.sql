SELECT "Creating new manuscript_deferral_note table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_deferral_note (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  page VARCHAR(45) NOT NULL,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_manuscript_id (manuscript_id ASC),
  UNIQUE INDEX uq_manuscript_id_page (manuscript_id ASC, page ASC),
  CONSTRAINT fk_manuscript_deferral_note_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
