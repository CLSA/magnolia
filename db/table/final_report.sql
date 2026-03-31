CREATE TABLE final_report (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  version INT(10) UNSIGNED NOT NULL DEFAULT 1,
  datetime DATETIME NOT NULL,
  achieved_objectives TINYINT(1) NULL DEFAULT NULL,
  findings TEXT NULL DEFAULT NULL,
  thesis_title TEXT NULL DEFAULT NULL,
  thesis_status TEXT NULL DEFAULT NULL,
  impact TEXT NULL DEFAULT NULL,
  opportunities TEXT NULL DEFAULT NULL,
  dissemination TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reqn_id_version (reqn_id ASC, version ASC),
  INDEX fk_reqn_id (reqn_id ASC),
  CONSTRAINT fk_final_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
