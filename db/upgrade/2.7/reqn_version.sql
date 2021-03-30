DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    SELECT "Adding new peer_review column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "peer_review";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN peer_review TINYINT(1) NULL DEFAULT NULL AFTER analysis;

      -- By default, all reqns except for those in the new stage get peer_review = no
      UPDATE reqn
      JOIN reqn_version ON reqn.id = reqn_version.reqn_id
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      SET peer_review = false
      WHERE stage_type.name != "New";
    END IF;

    SELECT "Adding new peer_review_filename column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "peer_review_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN peer_review_filename VARCHAR(255) NULL DEFAULT NULL AFTER peer_review;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
