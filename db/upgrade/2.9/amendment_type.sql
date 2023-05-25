DROP PROCEDURE IF EXISTS patch_amendment_type;
DELIMITER //
CREATE PROCEDURE patch_amendment_type()
  BEGIN

    SELECT "Adding fee_canada column to amendment_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "fee_canada";

    IF @test = 0 THEN
      ALTER TABLE amendment_type
      ADD COLUMN fee_canada INT UNSIGNED NOT NULL DEFAULT 0
      AFTER new_user;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "fee_international";

    IF @test = 0 THEN
      ALTER TABLE amendment_type
      ADD COLUMN fee_international INT UNSIGNED NOT NULL DEFAULT 0
      AFTER fee_canada;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_type();
DROP PROCEDURE IF EXISTS patch_amendment_type;
