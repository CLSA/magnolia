CREATE TABLE amendment (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  name char(1) NOT NULL,
  fee_schedule_id int(10) unsigned NOT NULL,
  fee int(10) DEFAULT NULL,
  override_fee int(10) DEFAULT NULL,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_name (reqn_id,name),
  KEY fk_reqn_id (reqn_id),
  KEY fk_fee_schedule_id (fee_schedule_id),
  CONSTRAINT fk_amendment_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES fee_schedule (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_amendment_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
