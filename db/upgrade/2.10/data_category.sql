DELIMITER $$

DROP TRIGGER IF EXISTS data_category_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER data_category_AFTER_INSERT AFTER INSERT ON data_category FOR EACH ROW
BEGIN
  IF NEW.comment THEN
    INSERT INTO reqn_version_comment( reqn_version_id, data_category_id )
    SELECT reqn_version.id, NEW.id
    FROM reqn_version;
  END IF;
END$$

DROP TRIGGER IF EXISTS data_category_BEFORE_UPDATE$$
CREATE DEFINER=CURRENT_USER TRIGGER data_category_BEFORE_UPDATE BEFORE UPDATE ON data_category FOR EACH ROW
BEGIN
  IF NEW.comment != OLD.comment THEN
    IF NEW.comment THEN
      INSERT IGNORE INTO reqn_version_comment( reqn_version_id, data_category_id )
      SELECT reqn_version.id, NEW.id
      FROM reqn_version;
    ELSE
      DELETE FROM reqn_version_comment WHERE data_category_id = NEW.id;
    END IF;
  END IF;
END$$

DELIMITER ;
