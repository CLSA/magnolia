CREATE PROCEDURE update_amendment_current_reqn_version(IN proc_amendment_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO amendment_current_reqn_version( amendment_id, reqn_version_id )
  SELECT amendment.id, reqn_version.id
  FROM amendment
  LEFT JOIN reqn_version ON amendment.id = reqn_version.amendment_id
  AND reqn_version.version <=> (
    SELECT MAX( version )
    FROM reqn_version
    WHERE amendment.id = reqn_version.amendment_id
  )
  WHERE amendment.id = proc_amendment_id;
END ;;