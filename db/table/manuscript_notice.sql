CREATE TABLE manuscript_notice (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  manuscript_id int(10) unsigned NOT NULL,
  datetime datetime NOT NULL,
  title varchar(127) NOT NULL,
  description text NOT NULL,
  PRIMARY KEY (id),
  KEY fk_manuscript_id (manuscript_id),
  CONSTRAINT fk_manuscript_notice_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
