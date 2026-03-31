CREATE TABLE pdf_form (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  pdf_form_type_id INT(10) UNSIGNED NOT NULL,
  version DATE NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 0,
  data LONGTEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_pdf_form_type_id (pdf_form_type_id ASC),
  UNIQUE INDEX uq_pdf_form_type_id_version (pdf_form_type_id ASC, version ASC),
  CONSTRAINT fk_pdf_form_pdf_form_type_id
    FOREIGN KEY (pdf_form_type_id)
    REFERENCES magnolia.pdf_form_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
