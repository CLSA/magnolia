CREATE TABLE reqn_last_amendment_with_agreement (
  reqn_id int(10) unsigned NOT NULL,
  amendment_id int(10) unsigned DEFAULT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (reqn_id),
  KEY fk_amendment_id (amendment_id),
  CONSTRAINT fk_reqn_last_amendment_with_agreement_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES amendment (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_last_amendment_with_agreement_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
