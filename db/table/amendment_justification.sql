CREATE TABLE amendment_justification (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_version_id int(10) unsigned NOT NULL,
  amendment_type_id int(10) unsigned NOT NULL,
  description text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_version_id_amendment_type_id (reqn_version_id,amendment_type_id),
  KEY fk_reqn_version_id (reqn_version_id),
  KEY fk_amendment_type_id (amendment_type_id),
  CONSTRAINT fk_amendment_justification_amendment_type_id
    FOREIGN KEY (amendment_type_id)
    REFERENCES amendment_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_amendment_justification_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
