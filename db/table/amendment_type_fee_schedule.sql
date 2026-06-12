CREATE TABLE amendment_type_fee_schedule (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  amendment_type_id int(10) unsigned NOT NULL,
  fee_schedule_id int(10) unsigned NOT NULL,
  fee_national int(10) NOT NULL DEFAULT 0,
  fee_international int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_amendment_type_id_fee_schedule_id (amendment_type_id,fee_schedule_id),
  KEY fk_amendment_type_id (amendment_type_id),
  KEY fk_fee_schedule_id (fee_schedule_id),
  CONSTRAINT fk_amendment_type_fee_schedule_amendment_type_id
    FOREIGN KEY (amendment_type_id)
    REFERENCES amendment_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_amendment_type_fee_schedule_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES fee_schedule (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
