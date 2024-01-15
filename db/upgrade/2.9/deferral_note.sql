SELECT "Creating new deferral_note table" AS "";

CREATE TABLE IF NOT EXISTS deferral_note (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT(10) UNSIGNED NOT NULL,
  form VARCHAR(45) NOT NULL,
  page VARCHAR(45) NOT NULL,
  note TEXT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_form_page (reqn_id ASC, form ASC, page ASC),
  CONSTRAINT fk_deferral_note_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
