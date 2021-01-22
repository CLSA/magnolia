SELECT "Creating new update_reqn_current_final_report procedure" AS "";

DELIMITER $$

DROP procedure IF EXISTS update_reqn_current_final_report;

CREATE PROCEDURE update_reqn_current_final_report(IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_current_final_report( reqn_id, final_report_id )
  SELECT reqn.id, final_report.id
  FROM reqn 
  LEFT JOIN final_report ON reqn.id = final_report.reqn_id
  AND CONCAT( final_report.amendment, final_report.version ) <=> (
    SELECT MAX( CONCAT( amendment, version ) )
    FROM final_report
    WHERE reqn.id = final_report.reqn_id
    GROUP BY final_report.reqn_id
    LIMIT 1
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
