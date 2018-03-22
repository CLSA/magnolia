SELECT "Creating new update_reqn_last_stage procedure" AS "";

DROP procedure IF EXISTS update_reqn_last_stage;

DELIMITER $$

CREATE PROCEDURE update_reqn_last_stage (IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_last_stage( reqn_id, stage_id )
  SELECT reqn.id, stage.id
  FROM reqn
  LEFT JOIN stage ON reqn.id = stage.reqn_id
  AND stage.datetime <=> (
    SELECT MAX( datetime )
    FROM stage
    WHERE reqn.id = stage.reqn_id
    GROUP BY stage.reqn_id
    LIMIT 1
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
