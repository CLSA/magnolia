SELECT "Creating new reqn_current_final_report table" AS "";

CREATE TABLE IF NOT EXISTS reqn_current_final_report (
  reqn_id INT(10) UNSIGNED NOT NULL,
  final_report_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (reqn_id),
  INDEX fk_final_report_id (final_report_id ASC),
  CONSTRAINT fk_reqn_current_final_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_current_final_report_final_report_id
    FOREIGN KEY (final_report_id)
    REFERENCES final_report (id)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

REPLACE INTO reqn_current_final_report( reqn_id, final_report_id )
SELECT reqn.id, final_report.id
FROM reqn 
LEFT JOIN final_report ON reqn.id = final_report.reqn_id
AND final_report.version <=> (
  SELECT MAX( version )
  FROM final_report
  WHERE reqn.id = final_report.reqn_id
  GROUP BY final_report.reqn_id
  LIMIT 1
);
