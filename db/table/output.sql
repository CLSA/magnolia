CREATE TABLE output (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  output_type_id int(10) unsigned NOT NULL,
  detail varchar(1023) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_detail (reqn_id,detail) USING HASH,
  KEY fk_output_type_id (output_type_id),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_output_output_type_id
    FOREIGN KEY (output_type_id)
    REFERENCES output_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_output_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;