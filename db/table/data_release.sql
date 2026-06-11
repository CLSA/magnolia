CREATE TABLE data_release (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  data_version_id int(10) unsigned NOT NULL,
  category enum('standard','amendment','data release update') NOT NULL DEFAULT 'standard',
  date date NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_data_version_id_date (reqn_id,data_version_id,date),
  KEY fk_reqn_id (reqn_id),
  KEY fk_data_version_id (data_version_id),
  CONSTRAINT fk_data_release_data_version_id
    FOREIGN KEY (data_version_id)
    REFERENCES data_version (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_release_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;