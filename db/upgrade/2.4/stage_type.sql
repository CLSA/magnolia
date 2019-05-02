DROP PROCEDURE IF EXISTS patch_stage_type;
DELIMITER //
CREATE PROCEDURE patch_stage_type()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "stage_type"
    AND column_name = "decision";

    IF @test = 1 THEN
      ALTER TABLE stage_type DROP COLUMN decision;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM stage_type
    WHERE name = "Suggested Revisions";

    IF @test = 0 THEN
      SELECT "Creating new Suggested Revisions stage type" AS "";

      -- push forward existing stage ranks
      UPDATE stage_type SET rank = 17 WHERE rank = 16;
      UPDATE stage_type SET rank = 16 WHERE rank = 15;
      UPDATE stage_type SET rank = 15 WHERE rank = 14;
      UPDATE stage_type SET rank = 14 WHERE rank = 13;
      UPDATE stage_type SET rank = 13 WHERE rank = 12;
      UPDATE stage_type SET rank = 12 WHERE rank = 11;

      INSERT IGNORE INTO stage_type SET
        phase = "review",
        rank = 11,
        name = "Suggested Revisions",
        status = "Suggested Revisions";

      SELECT "Changing stage type notifications to after the stage is complete instead of when it starts" AS "";

      UPDATE stage_type
      SET notification_type_id = NULL
      WHERE name IN ( "Agreement", "Active", "Report Required", "Not Approved" );

      UPDATE stage_type
      SET notification_type_id = ( SELECT id FROM notification_type WHERE name = "Notice of decision" )
      WHERE name = "Decision Made";

      UPDATE stage_type
      SET notification_type_id = ( SELECT id FROM notification_type WHERE name = "Data Available" )
      WHERE name = "Data Release";

      UPDATE stage_type
      SET notification_type_id = ( SELECT id FROM notification_type WHERE name = "Final report required" )
      WHERE name = "Active";
    END IF;

  END //
DELIMITER ;

CALL patch_stage_type();
DROP PROCEDURE IF EXISTS patch_stage_type;
