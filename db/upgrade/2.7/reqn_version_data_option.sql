SELECT "Updating reqn_version_data_option triggers with new data_option_justification table" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS reqn_version_data_option_AFTER_INSERT$$

CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_data_option_AFTER_INSERT AFTER INSERT ON reqn_version_data_option FOR EACH ROW
BEGIN
  -- make sure the data_option_justification record exists
  INSERT IGNORE INTO data_option_justification
  SET reqn_version_id = NEW.reqn_version_id,
      data_option_id = NEW.data_option_id;
END$$

DROP TRIGGER IF EXISTS reqn_version_data_option_AFTER_DELETE$$

CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_data_option_AFTER_DELETE AFTER DELETE ON reqn_version_data_option FOR EACH ROW
BEGIN
  -- remove the data_option_justification if this was the last selected data_option
  SELECT COUNT(*) INTO @count
  FROM reqn_version_data_option
  WHERE reqn_version_id = OLD.reqn_version_id
  AND data_option_id = OLD.data_option_id;

  IF 0 = @count THEN
    DELETE FROM data_option_justification
    WHERE reqn_version_id = OLD.reqn_version_id
    AND data_option_id = OLD.data_option_id;
  END IF;
END$$

DELIMITER ;
