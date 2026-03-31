CREATE TRIGGER reqn_version_AFTER_UPDATE
AFTER UPDATE ON magnolia.reqn_version FOR EACH ROW
BEGIN
  IF NOT NEW.agreement_filename <=> OLD.agreement_filename THEN
    SELECT reqn_id INTO @reqn_id
    FROM amendment
    JOIN reqn_version ON amendment.id = reqn_version.amendment_id
    WHERE reqn_version.id = NEW.id;