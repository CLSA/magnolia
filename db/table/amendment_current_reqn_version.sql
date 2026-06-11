CREATE TABLE amendment_current_reqn_version (
  amendment_id int(10) unsigned NOT NULL,
  reqn_version_id int(10) unsigned DEFAULT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (amendment_id),
  KEY fk_reqn_version_id (reqn_version_id),
  CONSTRAINT fk_amendment_current_reqn_version_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES amendment (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_amendment_current_reqn_version_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;