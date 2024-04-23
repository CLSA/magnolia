SELECT "Creating new manuscript_attachment table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_attachment (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  data LONGTEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_manuscript_id (manuscript_id ASC),
  UNIQUE INDEX uq_manuscript_id_filename (manuscript_id ASC, filename ASC),
  CONSTRAINT fk_manuscript_attachment_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
