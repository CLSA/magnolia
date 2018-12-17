SELECT "Creating new update_reqn_current_reqn_version procedure" AS "";

DELIMITER $$

DROP procedure IF EXISTS update_reqn_current_reqn_version;

CREATE PROCEDURE update_reqn_current_reqn_version (IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_current_reqn_version( reqn_id, reqn_version_id )
  SELECT reqn.id, reqn_version.id
  FROM reqn
  LEFT JOIN reqn_version ON reqn.id = reqn_version.reqn_id
  AND reqn_version.version <=> (
    SELECT MAX( version )
    FROM reqn_version
    WHERE reqn.id = reqn_version.reqn_id
    GROUP BY reqn_version.reqn_id
    LIMIT 1
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
