SELECT "Creating new update_reqn_current_amendment procedure" AS "";

DELIMITER $$

DROP PROCEDURE IF EXISTS update_reqn_current_amendment$$
CREATE DEFINER=CURRENT_USER PROCEDURE update_reqn_current_amendment(IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_current_amendment( reqn_id, amendment_id )
  SELECT reqn.id, amendment.id
  FROM reqn
  LEFT JOIN amendment ON reqn.id = amendment.reqn_id
  AND amendment.name <=> (
    SELECT MAX( name )
    FROM amendment
    WHERE reqn.id = amendment.reqn_id
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
