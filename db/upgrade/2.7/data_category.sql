DROP PROCEDURE IF EXISTS patch_data_category;
DELIMITER //
CREATE PROCEDURE patch_data_category()
  BEGIN

    SELECT "Renaming data_option_category table to data_category" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category";

    IF 0 < @test THEN
      RENAME TABLE data_option_category TO data_category;
    END IF;

  END //
DELIMITER ;

CALL patch_data_category();
DROP PROCEDURE IF EXISTS patch_data_category;


SELECT "Updating data_category triggers" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS data_category_AFTER_INSERT$$

CREATE DEFINER = CURRENT_USER TRIGGER data_category_AFTER_INSERT AFTER INSERT ON data_category FOR EACH ROW
BEGIN
  IF NEW.comment THEN 
    -- create corresponding reqn_version_comment records
    INSERT INTO reqn_version_comment( create_timestamp, reqn_version_id, data_category_id )
    SELECT NEW.create_timestamp, reqn_version.id, NEW.id
    FROM reqn_version;
  END IF;
END$$

DROP TRIGGER IF EXISTS data_category_BEFORE_UPDATE$$

CREATE DEFINER = CURRENT_USER TRIGGER data_category_BEFORE_UPDATE BEFORE UPDATE ON data_category FOR EACH ROW
BEGIN
  IF NEW.comment != OLD.comment THEN 
    IF NEW.comment THEN 
      -- create corresponding reqn_version_comment records
      INSERT IGNORE INTO reqn_version_comment( create_timestamp, reqn_version_id, data_category_id )
      SELECT NEW.create_timestamp, reqn_version.id, NEW.id
      FROM reqn_version;
    ELSE 
      -- remove corresponding reqn_version_comment records (keep filled out records)
      DELETE FROM reqn_version_comment WHERE data_category_id = NEW.id AND comment IS NULL;
    END IF;
  END IF;
END$$

DELIMITER ;
