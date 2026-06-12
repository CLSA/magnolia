CREATE TRIGGER reqn_version_has_amendment_type_AFTER_INSERT AFTER INSERT ON reqn_version_has_amendment_type FOR EACH ROW
BEGIN

  SELECT justification_prompt_en IS NOT NULL OR justification_prompt_fr IS NOT NULL INTO @justification
  FROM amendment_type
  WHERE id = NEW.amendment_type_id;

  IF @justification THEN
    INSERT IGNORE INTO amendment_justification
    SET reqn_version_id = NEW.reqn_version_id,
        amendment_type_id = NEW.amendment_type_id;
  END IF;
END ;;
