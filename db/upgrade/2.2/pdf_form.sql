SELECT "Creating new pdf_form table" AS "";

CREATE TABLE IF NOT EXISTS pdf_form (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  pdf_form_type_id INT UNSIGNED NOT NULL,
  version DATE NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX fk_pdf_form_type_id (pdf_form_type_id ASC),
  UNIQUE INDEX uq_pdf_form_type_id_version (pdf_form_type_id ASC, version ASC),
  CONSTRAINT fk_pdf_form_pdf_form_type_id
    FOREIGN KEY (pdf_form_type_id)
    REFERENCES pdf_form_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
