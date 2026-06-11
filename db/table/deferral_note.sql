CREATE TABLE deferral_note (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  form varchar(45) NOT NULL,
  page varchar(45) NOT NULL,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_form_page (reqn_id,form,page),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_deferral_note_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;