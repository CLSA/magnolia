DROP PROCEDURE IF EXISTS patch_stage_type;
DELIMITER //
CREATE PROCEDURE patch_stage_type()
  BEGIN

    SELECT COLUMN_TYPE LIKE "%finalization%" INTO @test
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = database()
    AND TABLE_NAME = "stage_type"
    AND COLUMN_NAME = "phase";

    IF @test = 0 THEN
      SELECT "Adding new finalization phase-type to stage_type table" AS "";

      ALTER TABLE stage_type
      MODIFY phase ENUM('new','review','active','finalization','complete') NOT NULL;

      SELECT "Creating new stage types" AS "";

      -- push forward existing stage ranks
      UPDATE stage_type SET rank = 24 WHERE rank = 19;
      UPDATE stage_type SET rank = 23 WHERE rank = 18;
      UPDATE stage_type SET rank = 22 WHERE rank = 17;
      UPDATE stage_type SET rank = 21 WHERE rank = 16;

      INSERT IGNORE INTO stage_type SET
        phase = "finalization",
        rank = 16,
        name = "Admin Report Review",
        status = "Finalization";

      INSERT IGNORE INTO stage_type SET
        phase = "finalization",
        rank = 17,
        name = "DCC Review",
        status = "Finalization";

      INSERT IGNORE INTO stage_type SET
        phase = "finalization",
        rank = 18,
        name = "Communications Review",
        status = "Finalization";

      INSERT IGNORE INTO stage_type SET
        phase = "finalization",
        rank = 19,
        name = "Pre Data Destruction",
        status = "Finalization";

      INSERT IGNORE INTO stage_type SET
        phase = "finalization",
        rank = 20,
        name = "Data Destruction",
        status = "Data Destruction";
    END IF;

    UPDATE stage_type SET phase = "finalization" WHERE name = "Report Required";

  END //
DELIMITER ;

CALL patch_stage_type();
DROP PROCEDURE IF EXISTS patch_stage_type;
