DROP PROCEDURE IF EXISTS patch_ethics_approval_2;
DELIMITER //
CREATE PROCEDURE patch_ethics_approval_2()
  BEGIN

    SELECT "Adding records to ethics_approval table" AS "";

    SELECT COUNT(*) INTO @test FROM ethics_approval;

    IF @test = 0 THEN
      INSERT INTO ethics_approval( reqn_id, filename, date )
      SELECT reqn.id, ethics_filename, ethics_date
      FROM reqn
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      JOIN reqn_current_reqn_version ON reqn.id = reqn_current_reqn_version.reqn_id
      JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
      WHERE stage_type.name = "Active"
      AND ethics = "yes"
      AND ethics_filename IS NOT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_ethics_approval_2();
DROP PROCEDURE IF EXISTS patch_ethics_approval_2;
