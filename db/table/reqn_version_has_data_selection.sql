CREATE TABLE reqn_version_has_data_selection (
  reqn_version_id int(10) unsigned NOT NULL,
  data_selection_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (reqn_version_id,data_selection_id),
  KEY fk_data_selection_id (data_selection_id),
  KEY fk_reqn_version_id (reqn_version_id),
  CONSTRAINT fk_reqn_version_has_data_selection_data_selection_id
    FOREIGN KEY (data_selection_id)
    REFERENCES data_selection (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_has_data_selection_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
