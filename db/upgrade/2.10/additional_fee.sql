DROP PROCEDURE IF EXISTS patch_additional_fee;
DELIMITER //
CREATE PROCEDURE patch_additional_fee()
  BEGIN

    SELECT "Renaming cost to fee column in additional_fee table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "additional_fee"
    AND column_name = "cost";

    IF @test = 1 THEN
      ALTER TABLE additional_fee RENAME COLUMN cost TO fee;
    END IF;

  END //
DELIMITER ;

CALL patch_additional_fee();
DROP PROCEDURE IF EXISTS patch_additional_fee;
