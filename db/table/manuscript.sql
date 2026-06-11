CREATE TABLE manuscript (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  title varchar(511) NOT NULL,
  deferred tinyint(1) NOT NULL DEFAULT 0,
  deferred_date date DEFAULT NULL,
  suggested_revisions tinyint(1) NOT NULL DEFAULT 0,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_title (reqn_id,title),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_manuscript_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;