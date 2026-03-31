CREATE TABLE reqn_current_destruction_report (
  reqn_id INT(10) UNSIGNED NOT NULL,
  destruction_report_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (reqn_id),
  INDEX fk_destruction_report_id (destruction_report_id ASC),
  CONSTRAINT fk_reqn_current_destruction_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_current_destruction_report_destruction_report_id
    FOREIGN KEY (destruction_report_id)
    REFERENCES magnolia.destruction_report (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
