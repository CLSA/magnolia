CREATE TABLE reqn_last_ethics_approval (
  reqn_id int(10) unsigned NOT NULL,
  ethics_approval_id int(10) unsigned DEFAULT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (reqn_id),
  KEY fk_ethics_approval_id (ethics_approval_id),
  CONSTRAINT fk_reqn_last_ethics_approval_ethics_approval_id
    FOREIGN KEY (ethics_approval_id)
    REFERENCES ethics_approval (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_last_ethics_approval_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
