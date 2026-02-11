SELECT "Creating new reqn_document table" AS "";

CREATE TABLE IF NOT EXISTS reqn_document (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  data LONGTEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_filename (reqn_id ASC, filename ASC),
  CONSTRAINT fk_reqn_document_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
