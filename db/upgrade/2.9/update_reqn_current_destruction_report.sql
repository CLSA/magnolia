SELECT "Creating new update_reqn_current_destruction_report procedure" AS "";

DELIMITER $$

DROP PROCEDURE IF EXISTS update_reqn_current_destruction_report$$
CREATE DEFINER=CURRENT_USER PROCEDURE update_reqn_current_destruction_report(IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
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
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
