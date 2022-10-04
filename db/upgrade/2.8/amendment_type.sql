DROP PROCEDURE IF EXISTS patch_amendment_type;
DELIMITER //
CREATE PROCEDURE patch_amendment_type()
  BEGIN

    SELECT "Adding show_in_description column to amendment_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "show_in_description";

    IF @test = 0 THEN
      ALTER TABLE amendment_type ADD COLUMN show_in_description TINYINT(1) NOT NULL DEFAULT 0 AFTER new_user;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_type();
DROP PROCEDURE IF EXISTS patch_amendment_type;
