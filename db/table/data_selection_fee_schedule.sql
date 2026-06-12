CREATE TABLE data_selection_fee_schedule (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  data_selection_id int(10) unsigned NOT NULL,
  fee_schedule_id int(10) unsigned NOT NULL,
  fee int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_data_selection_id_fee_schedule_id (data_selection_id,fee_schedule_id),
  KEY fk_data_selection_id (data_selection_id),
  KEY fk_fee_schedule_id (fee_schedule_id),
  CONSTRAINT fk_data_selection_fee_schedule_data_selection_id
    FOREIGN KEY (data_selection_id)
    REFERENCES data_selection (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_data_selection_fee_schedule_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES fee_schedule (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
