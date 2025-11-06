DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding new new_trainee_user_id column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "new_trainee_user_id";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN new_trainee_user_id INT UNSIGNED NULL DEFAULT NULL AFTER new_user_id;
      ALTER TABLE reqn_version ADD INDEX fk_new_trainee_user_id (new_trainee_user_id ASC);
      SET @sql = CONCAT(
        "ALTER TABLE reqn_version ADD CONSTRAINT fk_reqn_version_new_trainee_user_id ",
        "FOREIGN KEY (new_trainee_user_id) ",
        "REFERENCES ", @cenozo, ".user (id) ",
        "ON DELETE NO ACTION ",
        "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

    SELECT "Adding new applicant_early_career column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "applicant_early_career";

    IF @test = 0 THEN
      ALTER TABLE reqn_version
      ADD COLUMN applicant_early_career TINYINT(1) NULL DEFAULT NULL AFTER applicant_position;

      -- backfill existing records
      UPDATE reqn_version
      JOIN stage ON reqn_version.reqn_id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      SET reqn_version.applicant_early_career = false
      WHERE stage_type.name != "New";
    END IF;

    SELECT "Adding new trainee_project column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "trainee_project";

    IF @test = 0 THEN
      ALTER TABLE reqn_version
      ADD COLUMN trainee_project TINYINT(1) NULL DEFAULT NULL AFTER ethics_filename;

      -- backfill existing records
      UPDATE reqn_version
      SET trainee_project = true
      WHERE IFNULL(waiver, "none") != "none";

      UPDATE reqn_version
      JOIN stage ON reqn_version.reqn_id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      SET trainee_project = false
      WHERE IFNULL(waiver, "none") = "none"
      AND stage_type.name != "New";
    END IF;

    SELECT "Replacing amendment with amendment_id column in reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "amendment_id";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN amendment_id INT UNSIGNED NOT NULL AFTER amendment;

      UPDATE reqn_version
      JOIN amendment ON reqn_version.reqn_id = amendment.reqn_id AND reqn_version.amendment = amendment.name
      SET reqn_version.amendment_id = amendment.id;

      ALTER TABLE reqn_version
        ADD INDEX fk_amendment_id (amendment_id ASC),
        ADD UNIQUE INDEX uq_amendment_id_version (amendment_id ASC, version ASC);
      ALTER TABLE reqn_version ADD CONSTRAINT fk_reqn_version_amendment_id
        FOREIGN KEY (amendment_id)
        REFERENCES amendment (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

      ALTER TABLE reqn_version
        DROP INDEX uq_reqn_id_amendment_version,
        DROP COLUMN amendment;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
