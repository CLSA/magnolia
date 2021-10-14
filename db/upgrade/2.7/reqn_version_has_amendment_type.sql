SELECT "Updating reqn_version_has_amendment_type triggers" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS reqn_version_has_amendment_type_AFTER_INSERT;

CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_has_amendment_type_AFTER_INSERT AFTER INSERT ON reqn_version_has_amendment_type FOR EACH ROW
BEGIN
  -- make sure the amendment_justification record exists if the selected amendment type has a justification prompt
  SELECT justification_prompt_en IS NOT NULL OR justification_prompt_fr IS NOT NULL INTO @justification
  FROM amendment_type
  WHERE id = NEW.amendment_type_id;

  IF @justification THEN
    INSERT IGNORE INTO amendment_justification
    SET reqn_version_id = NEW.reqn_version_id,
        amendment_type_id = NEW.amendment_type_id;
  END IF;
END$$

DROP TRIGGER IF EXISTS reqn_version_has_amendment_type_AFTER_DELETE;

CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_has_amendment_type_AFTER_DELETE AFTER DELETE ON reqn_version_has_amendment_type FOR EACH ROW
BEGIN
  -- remove the associated amendment_justification
  DELETE FROM amendment_justification
  WHERE reqn_version_id = OLD.reqn_version_id
  AND amendment_type_id = OLD.amendment_type_id;
END$$

DELIMITER ;
