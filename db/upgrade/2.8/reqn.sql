DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Removing deferral_note_2g column from reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2g";

    IF @test = 1 THEN
      ALTER TABLE reqn DROP COLUMN deferral_note_2g;
    END IF;

    SELECT "Adding chair_note column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "chair_note";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN chair_note TEXT NULL DEFAULT NULL;
    END IF;

    SELECT "Adding deferral_note_cohort column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_cohort";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN deferral_note_cohort TEXT NULL DEFAULT NULL AFTER deferral_note_1f;
    END IF;

    SELECT "Adding deferral_note_2f column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2f";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN deferral_note_2f TEXT NULL DEFAULT NULL AFTER deferral_note_2e;
    END IF;

    SELECT "Adding deferral_note_indigenous column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_indigenous";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN deferral_note_indigenous TEXT NULL DEFAULT NULL AFTER deferral_note_cohort;
    END IF;

    SELECT "Adding non_payment column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "non_payment";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN non_payment TINYINT(1) NOT NULL DEFAULT 0 AFTER show_prices;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
