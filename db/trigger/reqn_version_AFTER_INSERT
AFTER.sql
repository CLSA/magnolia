CREATE TRIGGER reqn_version_AFTER_INSERT
AFTER INSERT ON magnolia.reqn_version FOR EACH ROW
BEGIN
  SELECT reqn_id INTO @reqn_id
  FROM amendment
  JOIN reqn_version ON amendment.id = reqn_version.amendment_id
  WHERE reqn_version.id = NEW.id;