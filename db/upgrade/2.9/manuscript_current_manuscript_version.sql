SELECT "Creating new manuscript_current_manuscript_version table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_current_manuscript_version (
  manuscript_id INT(10) UNSIGNED NOT NULL,
  manuscript_version_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (manuscript_id),
  INDEX fk_manuscript_version_id (manuscript_version_id ASC),
  CONSTRAINT fk_manuscript_current_manuscript_version_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_manuscript_current_manuscript_version_manuscript_version_id
    FOREIGN KEY (manuscript_version_id)
    REFERENCES manuscript_version (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;
