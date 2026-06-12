CREATE TABLE reference (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_version_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  reference varchar(512) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_version_id_rank (reqn_version_id,rank),
  KEY fk_reqn_version_id (reqn_version_id),
  CONSTRAINT fk_reference_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
