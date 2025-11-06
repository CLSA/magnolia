SELECT "Updating update_reqn_current_reqn_version procedure" AS "";

DROP PROCEDURE IF EXISTS update_reqn_current_reqn_version;

DELIMITER $$

CREATE DEFINER=CURRENT_USER PROCEDURE update_reqn_current_reqn_version(IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_current_reqn_version( reqn_id, reqn_version_id )
  SELECT reqn.id, reqn_version.id
  FROM reqn
  LEFT JOIN reqn_version ON reqn.id = reqn_version.reqn_id
  LEFT JOIN amendment ON reqn_version.amendment_id = amendment.id
  AND CONCAT( amendment.name, reqn_version.version ) <=> (
    SELECT MAX( CONCAT( amendment.name, version ) )
    FROM reqn_version
    JOIN amendment ON reqn_version.amendment_id = amendment.id
    WHERE reqn.id = reqn_version.reqn_id
    GROUP BY reqn_version.reqn_id
    LIMIT 1
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
