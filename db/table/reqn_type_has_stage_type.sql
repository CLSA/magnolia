CREATE TABLE reqn_type_has_stage_type (
  reqn_type_id int(10) unsigned NOT NULL,
  stage_type_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (reqn_type_id,stage_type_id),
  KEY fk_stage_type_id (stage_type_id),
  KEY fk_reqn_type_id (reqn_type_id),
  CONSTRAINT fk_reqn_type_has_stage_type_reqn_type_id
    FOREIGN KEY (reqn_type_id)
    REFERENCES reqn_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_type_has_stage_type_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES stage_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
