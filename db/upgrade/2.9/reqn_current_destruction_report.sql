SELECT "Creating new reqn_current_destruction_report table" AS "";

CREATE TABLE IF NOT EXISTS reqn_current_destruction_report (
  reqn_id INT(10) UNSIGNED NOT NULL,
  destruction_report_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (reqn_id),
  INDEX fk_destruction_report_id (destruction_report_id ASC),
  CONSTRAINT fk_reqn_current_destruction_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_current_destruction_report_destruction_report_id
    FOREIGN KEY (destruction_report_id)
    REFERENCES destruction_report (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

REPLACE INTO reqn_current_destruction_report( reqn_id, destruction_report_id )
SELECT reqn.id, destruction_report.id
FROM reqn 
LEFT JOIN destruction_report ON reqn.id = destruction_report.reqn_id
AND destruction_report.version <=> (
  SELECT MAX( version )
  FROM destruction_report
  WHERE reqn.id = destruction_report.reqn_id
  GROUP BY destruction_report.reqn_id
  LIMIT 1
);
