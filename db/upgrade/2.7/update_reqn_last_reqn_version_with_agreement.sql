SELECT "Creating new update_reqn_last_reqn_version_with_agreement procedure" AS "";

DROP PROCEDURE IF EXISTS update_reqn_last_reqn_version_with_agreement;

DELIMITER $$

CREATE PROCEDURE update_reqn_last_reqn_version_with_agreement (IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_last_reqn_version_with_agreement( reqn_id, reqn_version_id )
  SELECT reqn.id, reqn_version.id
  FROM reqn 
  LEFT JOIN reqn_version ON reqn.id = reqn_version.reqn_id
  AND CONCAT( reqn_version.amendment, reqn_version.version ) <=> (
    SELECT MAX( CONCAT( amendment, version ) )
    FROM reqn_version
    WHERE reqn.id = reqn_version.reqn_id
    AND reqn_version.agreement_filename IS NOT NULL 
    GROUP BY reqn_version.reqn_id
    LIMIT 1
  )
  WHERE reqn.id = proc_reqn_id;
END$$

DELIMITER ;
