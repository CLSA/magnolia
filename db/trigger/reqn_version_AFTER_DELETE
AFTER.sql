CREATE TRIGGER reqn_version_AFTER_DELETE
AFTER DELETE ON magnolia.reqn_version FOR EACH ROW
BEGIN
  SELECT reqn_id INTO @reqn_id
  FROM amendment
  JOIN reqn_version ON amendment.id = reqn_version.amendment_id
  WHERE reqn_version.id = OLD.id;