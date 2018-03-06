SELECT "Creating new update_requisition_last_stage procedure" AS "";

DROP procedure IF EXISTS update_requisition_last_stage;

DELIMITER $$

CREATE PROCEDURE update_requisition_last_stage (IN proc_requisition_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO requisition_last_stage( requisition_id, stage_id )
  SELECT requisition.id, stage.id
  FROM requisition
  JOIN stage ON requisition.id = stage.requisition_id
  AND stage.datetime <=> (
    SELECT MAX( datetime )
    FROM stage
    WHERE requisition.id = stage.requisition_id
    GROUP BY stage.requisition_id
    LIMIT 1
  )
  WHERE requisition.id = proc_requisition_id;
END$$

DELIMITER ;
