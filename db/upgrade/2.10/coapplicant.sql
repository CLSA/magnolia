DROP PROCEDURE IF EXISTS patch_coapplicant;
DELIMITER //
CREATE PROCEDURE patch_coapplicant()
  BEGIN

    SELECT "Adding new trainee column to coapplicant table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "coapplicant"
    AND column_name = "trainee";

    IF @test = 0 THEN
      ALTER TABLE coapplicant ADD COLUMN trainee TINYINT(1) NOT NULL DEFAULT 0 AFTER role;
    END IF;

  END //
DELIMITER ;

CALL patch_coapplicant();
DROP PROCEDURE IF EXISTS patch_coapplicant;
