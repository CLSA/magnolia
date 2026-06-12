CREATE TABLE pdf_form (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  pdf_form_type_id int(10) unsigned NOT NULL,
  version date NOT NULL,
  active tinyint(1) NOT NULL DEFAULT 0,
  data longtext NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pdf_form_type_id_version (pdf_form_type_id,version),
  KEY fk_pdf_form_type_id (pdf_form_type_id),
  CONSTRAINT fk_pdf_form_pdf_form_type_id
    FOREIGN KEY (pdf_form_type_id)
    REFERENCES pdf_form_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
