CREATE TABLE reqn_current_final_report (
  reqn_id int(10) unsigned NOT NULL,
  final_report_id int(10) unsigned DEFAULT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (reqn_id),
  KEY fk_final_report_id (final_report_id),
  CONSTRAINT fk_reqn_current_final_report_final_report_id
    FOREIGN KEY (final_report_id)
    REFERENCES final_report (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_current_final_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;