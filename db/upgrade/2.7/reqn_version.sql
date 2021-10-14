DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

     -- determine the @cenozo database name
     SET @cenozo = (
       SELECT unique_constraint_schema
       FROM information_schema.referential_constraints
       WHERE constraint_schema = DATABASE()
       AND constraint_name = "fk_access_site_id"
     );

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

    SELECT "Adding agreement_start_date column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "agreement_start_date";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN agreement_start_date DATE NULL DEFAULT NULL AFTER agreement_filename;
    END IF;

    SELECT "Adding agreement_end_date column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "agreement_end_date";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN agreement_end_date DATE NULL DEFAULT NULL AFTER agreement_start_date;
    END IF;

    SELECT "Removing amendment_justification column from reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "amendment_justification";

    IF @test = 1 THEN
      ALTER TABLE reqn_version DROP COLUMN amendment_justification;
    END IF;

    SELECT "Adding applicant_country_id column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "applicant_country_id";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN applicant_country_id INT UNSIGNED NULL DEFAULT NULL AFTER applicant_address;

      SET @sql = CONCAT(
        "ALTER TABLE reqn_version ",
          "ADD INDEX fk_applicant_country_id (applicant_country_id ASC), ",
          "ADD CONSTRAINT fk_reqn_version_applicant_country_id ",
            "FOREIGN KEY (applicant_country_id) ",
            "REFERENCES ", @cenozo, ".country (id) ",
            "ON DELETE NO ACTION ",
            "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

    SELECT "Adding trainee_country_id column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "trainee_country_id";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN trainee_country_id INT UNSIGNED NULL DEFAULT NULL AFTER trainee_address;

      SET @sql = CONCAT(
        "ALTER TABLE reqn_version ",
          "ADD INDEX fk_trainee_country_id (trainee_country_id ASC), ",
          "ADD CONSTRAINT fk_reqn_version_trainee_country_id ",
            "FOREIGN KEY (trainee_country_id) ",
            "REFERENCES ", @cenozo, ".country (id) ",
            "ON DELETE NO ACTION ",
            "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;


DELIMITER $$

DROP TRIGGER IF EXISTS reqn_version_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_AFTER_INSERT AFTER INSERT ON reqn_version FOR EACH ROW
BEGIN
  CALL update_reqn_current_reqn_version( NEW.reqn_id );
  CALL update_reqn_last_reqn_version_with_agreement( NEW.reqn_id );

  -- create reqn_version_comment
  INSERT INTO reqn_version_comment( create_timestamp, reqn_version_id, data_category_id )
  SELECT NEW.create_timestamp, NEW.id, data_category.id
  FROM data_category
  WHERE comment = true;
END$$

DROP TRIGGER IF EXISTS reqn_version_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_AFTER_DELETE AFTER DELETE ON reqn_version FOR EACH ROW
BEGIN
  CALL update_reqn_current_reqn_version( OLD.reqn_id );
  CALL update_reqn_last_reqn_version_with_agreement( OLD.reqn_id );
END$$

DROP TRIGGER IF EXISTS reqn_version_AFTER_UPDATE $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_AFTER_UPDATE AFTER UPDATE ON reqn_version FOR EACH ROW
BEGIN
  IF NEW.agreement_filename != OLD.agreement_filename THEN
    CALL update_reqn_last_reqn_version_with_agreement( NEW.reqn_id );
  END IF;
END$$

DELIMITER ;
