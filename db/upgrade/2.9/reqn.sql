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

    SELECT "Adding override_price column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "override_price";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN override_price INT(10) UNSIGNED NULL DEFAULT NULL AFTER show_prices;
    END IF;

    SELECT "Adding special_fee_waiver_id column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "special_fee_waiver_id";

    IF @test = 0 THEN
      ALTER TABLE reqn
      ADD COLUMN special_fee_waiver_id INT UNSIGNED NULL DEFAULT NULL AFTER deadline_id,
      ADD INDEX fk_special_fee_waiver_id (special_fee_waiver_id ASC);

      ALTER TABLE reqn
      ADD CONSTRAINT fk_reqn_special_fee_waiver_id
        FOREIGN KEY (special_fee_waiver_id)
        REFERENCES special_fee_waiver (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
    END IF;

    SELECT "Removing defunct deferral_note columns from reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_amendment";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "instructions", deferral_note_amendment
      FROM reqn WHERE deferral_note_amendment IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_amendment;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_1a";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "applicant", deferral_note_1a
      FROM reqn WHERE deferral_note_1a IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_1a;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_1b";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "project_team", deferral_note_1b
      FROM reqn WHERE deferral_note_1b IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_1b;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_1c";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "timeline", deferral_note_1c
      FROM reqn WHERE deferral_note_1c IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_1c;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_1d";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "description", deferral_note_1d
      FROM reqn WHERE deferral_note_1d IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_1d;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_1e";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "scientific_review", deferral_note_1e
      FROM reqn WHERE deferral_note_1e IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_1e;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_1f";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "ethics", deferral_note_1f
      FROM reqn WHERE deferral_note_1f IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_1f;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_cohort";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "cohort", deferral_note_cohort
      FROM reqn WHERE deferral_note_cohort IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_cohort;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_indigenous";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "indigenous", deferral_note_indigenous
      FROM reqn WHERE deferral_note_indigenous IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_indigenous;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2a";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "core_clsa_data", deferral_note_2a
      FROM reqn WHERE deferral_note_2a IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_2a;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2b";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "linked_data", deferral_note_2b
      FROM reqn WHERE deferral_note_2b IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_2b;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2c";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "images_and_raw_data", deferral_note_2c
      FROM reqn WHERE deferral_note_2c IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_2c;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2d";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "geographic_indicators", deferral_note_2d
      FROM reqn WHERE deferral_note_2d IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_2d;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2e";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "covid_19_data", deferral_note_2e
      FROM reqn WHERE deferral_note_2e IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_2e;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2f";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "application", "mortality_data", deferral_note_2f
      FROM reqn WHERE deferral_note_2f IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_2f;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_report1";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "final_report", "part_1", deferral_note_report1
      FROM reqn WHERE deferral_note_report1 IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_report1;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_report2";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "final_report", "part_2", deferral_note_report2
      FROM reqn WHERE deferral_note_report2 IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_report2;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_report3";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "final_report", "part_3", deferral_note_report3
      FROM reqn WHERE deferral_note_report3 IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_report3;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_destruction";

    IF @test = 1 THEN
      -- move all notes to the deferral_note table
      INSERT INTO deferral_note( reqn_id, form, page, note )
      SELECT reqn.id, "destruction", "data_destroy", deferral_note_destruction
      FROM reqn WHERE deferral_note_destruction IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN deferral_note_destruction;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;

SELECT "Updating reqn after insert trigger" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS reqn_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER reqn_AFTER_INSERT AFTER INSERT ON reqn FOR EACH ROW BEGIN
  CALL update_reqn_last_ethics_approval( NEW.id );
  CALL update_reqn_current_final_report( NEW.id );
  CALL update_reqn_current_destruction_report( NEW.id );
END$$

DELIMITER ;
