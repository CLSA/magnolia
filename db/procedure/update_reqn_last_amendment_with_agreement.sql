CREATE PROCEDURE update_reqn_last_amendment_with_agreement (IN proc_reqn_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO reqn_last_amendment_with_agreement(reqn_id, amendment_id)
  SELECT reqn.id, amendment.id
  FROM reqn
  LEFT JOIN amendment ON reqn.id = amendment.reqn_id
  AND amendment.name <=> (
    SELECT MAX(amendment.name)
    FROM amendment
    JOIN amendment_current_reqn_version
      ON amendment.id = amendment_current_reqn_version.amendment_id
    JOIN reqn_version ON amendment_current_reqn_version.reqn_version_id = reqn_version.id
    WHERE reqn.id = amendment.reqn_id
    AND reqn_version.agreement_filename IS NOT NULL
  )
  WHERE reqn.id = proc_reqn_id;
END$$
