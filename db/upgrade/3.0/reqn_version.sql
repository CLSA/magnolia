DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    SELECT "Adding new trainee_level column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "trainee_level";

    IF @test = 0 THEN
      ALTER TABLE reqn_version
      ADD COLUMN trainee_level ENUM('undergraduate','masters','phd','postdoc','clinical','other') NULL DEFAULT NULL
      AFTER trainee_program;

      -- set the trainee_level for all submitted reqns with a trainee to "Other"
      UPDATE reqn
      JOIN amendment ON reqn.id = amendment.reqn_id
      JOIN reqn_version ON amendment.id = reqn_version.amendment_id
      SET reqn_version.trainee_level = IF(
        "postdoc" = reqn_version.waiver OR "clinical" = reqn_version.waiver,
        reqn_version.waiver,
        IF("graduate", "phd", "other")
      )
      WHERE reqn.trainee_user_id IS NOT NULL
      AND reqn.id IN (
        SELECT reqn.id
        FROM reqn
        JOIN reqn_current_amendment ON reqn.id = reqn_current_amendment.reqn_id
        JOIN amendment ON reqn_current_amendment.amendment_id = amendment.id
        JOIN stage ON amendment.id = stage.amendment_id AND stage.datetime IS NULL
        JOIN stage_type ON stage.stage_type_id = stage_type.id
        WHERE stage_type.phase != "new"
      );
    END IF;

    SELECT "Converting waiver column in reqn_version table from ENUM to TINYINT" AS "";

    SELECT DATA_TYPE INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "waiver";

    IF @test = "enum" THEN
      ALTER TABLE reqn_version
      ADD COLUMN waiver2 TINYINT(1) NULL DEFAULT NULL
      AFTER waiver;

      UPDATE reqn_version SET waiver2 = "none" != waiver WHERE waiver IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN waiver;
      ALTER TABLE reqn_version RENAME COLUMN waiver2 TO waiver;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
