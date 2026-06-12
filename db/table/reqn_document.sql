CREATE TABLE reqn_document (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  filename varchar(255) NOT NULL,
  data longtext NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_filename (reqn_id,filename),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_reqn_document_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
