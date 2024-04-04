SELECT "Creating new manuscript_notice table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_notice (
  id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  datetime DATETIME NOT NULL,
  title VARCHAR(127) NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_manuscript_id (manuscript_id ASC),
  CONSTRAINT fk_manuscript_notice_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
