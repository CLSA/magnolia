CREATE TABLE manuscript_attachment (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  manuscript_id int(10) unsigned NOT NULL,
  filename varchar(255) NOT NULL,
  data longtext NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_manuscript_id_filename (manuscript_id,filename),
  KEY fk_manuscript_id (manuscript_id),
  CONSTRAINT fk_manuscript_attachment_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;