CREATE TABLE final_report (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  version int(10) unsigned NOT NULL DEFAULT 1,
  datetime datetime NOT NULL,
  achieved_objectives tinyint(1) DEFAULT NULL,
  findings text DEFAULT NULL,
  thesis_title text DEFAULT NULL,
  thesis_status text DEFAULT NULL,
  impact text DEFAULT NULL,
  opportunities text DEFAULT NULL,
  dissemination text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_version (reqn_id,version),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_final_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;