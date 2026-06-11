CREATE TABLE reqn_has_additional_fee (
  reqn_id int(10) unsigned NOT NULL,
  additional_fee_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (reqn_id,additional_fee_id),
  KEY fk_additional_fee_id (additional_fee_id),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_reqn_has_additional_fee_additional_fee_id
    FOREIGN KEY (additional_fee_id)
    REFERENCES additional_fee (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_has_additional_fee_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;