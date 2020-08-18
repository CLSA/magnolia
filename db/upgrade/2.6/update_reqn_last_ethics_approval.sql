SELECT "Creating new update_reqn_last_ethics_approval procedure" AS "";

DELIMITER $$

DROP procedure IF EXISTS update_reqn_last_ethics_approval;

CREATE PROCEDURE update_reqn_last_ethics_approval (IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_last_ethics_approval( reqn_id, ethics_approval_id )
  SELECT reqn.id, ethics_approval.id
  FROM reqn
  LEFT JOIN ethics_approval ON reqn.id = ethics_approval.reqn_id
  AND ethics_approval.date <=> (
    SELECT MAX( date )
    FROM ethics_approval
    WHERE reqn.id = ethics_approval.reqn_id
    GROUP BY ethics_approval.reqn_id
    LIMIT 1
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
