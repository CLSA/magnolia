CREATE TABLE reqn_current_destruction_report (
  reqn_id int(10) unsigned NOT NULL,
  destruction_report_id int(10) unsigned DEFAULT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (reqn_id),
  KEY fk_destruction_report_id (destruction_report_id),
  CONSTRAINT fk_reqn_current_destruction_report_destruction_report_id
    FOREIGN KEY (destruction_report_id)
    REFERENCES destruction_report (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_current_destruction_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;