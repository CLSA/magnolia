DROP PROCEDURE IF EXISTS patch_stage_type;
DELIMITER //
CREATE PROCEDURE patch_stage_type()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM stage_type
    WHERE name = "Incomplete";

    IF @test = 0 THEN
      SELECT "Creating new Incomplete stage type" AS "";

      -- push forward existing stage ranks
      UPDATE stage_type SET rank = 18 WHERE rank = 17;

      INSERT IGNORE INTO stage_type SET
        phase = "complete",
        rank = 17,
        name = "Incomplete",
        status = "Not Approved";
    END IF;

  END //
DELIMITER ;

CALL patch_stage_type();
DROP PROCEDURE IF EXISTS patch_stage_type;

SELECT "Changing 'SAC Review' review type to 'Feasibility Review'" AS "";
UPDATE stage_type
SET name = "Feasibility Review"
WHERE name = "SAC Review";
