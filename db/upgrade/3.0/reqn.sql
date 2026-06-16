DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    SELECT "Adding new catalyst column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "catalyst";

    IF @test = 0 THEN
      ALTER TABLE reqn
      ADD COLUMN catalyst TINYINT(1) NOT NULL DEFAULT 0
      AFTER data_expiry_date;

      UPDATE reqn
      JOIN reqn_type ON reqn.reqn_type_id = reqn_type.id
      SET catalyst = 1
      WHERE reqn_type.name = "Catalyst Grant";
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
