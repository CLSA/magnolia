CREATE TRIGGER reqn_version_AFTER_DELETE
AFTER DELETE ON magnolia.reqn_version FOR EACH ROW
BEGIN
  SELECT reqn_id INTO @reqn_id
  FROM amendment
  JOIN reqn_version ON amendment.id = reqn_version.amendment_id
  WHERE reqn_version.id = OLD.id;

  CALL update_reqn_last_amendment_with_agreement( @reqn_id );
  CALL update_amendment_current_reqn_version( OLD.amendment_id );
END$$
