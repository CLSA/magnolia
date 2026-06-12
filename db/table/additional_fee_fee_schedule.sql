CREATE TABLE additional_fee_fee_schedule (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  additional_fee_id int(10) unsigned NOT NULL,
  fee_schedule_id int(10) unsigned NOT NULL,
  fee int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_additional_fee_id_fee_schedule_id (additional_fee_id,fee_schedule_id),
  KEY fk_additional_fee_id (additional_fee_id),
  KEY fk_fee_schedule_id (fee_schedule_id),
  CONSTRAINT fk_additional_fee_fee_schedule_additional_fee_id
    FOREIGN KEY (additional_fee_id)
    REFERENCES additional_fee (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_additional_fee_fee_schedule_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES fee_schedule (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
