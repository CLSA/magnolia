CREATE TABLE manuscript_current_manuscript_version (
  manuscript_id int(10) unsigned NOT NULL,
  manuscript_version_id int(10) unsigned DEFAULT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (manuscript_id),
  KEY fk_manuscript_version_id (manuscript_version_id),
  CONSTRAINT fk_manuscript_current_manuscript_version_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_manuscript_current_manuscript_version_manuscript_version_id
    FOREIGN KEY (manuscript_version_id)
    REFERENCES manuscript_version (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
