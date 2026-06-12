CREATE TABLE data_justification (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_version_id int(10) unsigned NOT NULL,
  data_option_id int(10) unsigned NOT NULL,
  description text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_version_id_data_option_id (reqn_version_id,data_option_id),
  KEY fk_reqn_version_id (reqn_version_id),
  KEY fk_data_option_id (data_option_id),
  CONSTRAINT fk_data_justification_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES data_option (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_justification_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
