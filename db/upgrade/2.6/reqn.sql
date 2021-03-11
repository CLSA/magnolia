DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    SELECT "Adding new external column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "external";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN external TINYINT(1) NOT NULL DEFAULT 0 AFTER identifier;
    END IF;

    SELECT "Adding new data_sharing_approved column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "data_sharing_approved";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN data_sharing_approved TINYINT(1) NULL DEFAULT NULL AFTER website;

      -- set the column value for all reqns who have selected a linked-data option
      UPDATE reqn
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      JOIN reqn_current_reqn_version ON reqn.id = reqn_current_reqn_version.reqn_id
      JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
      JOIN reqn_version_data_option ON reqn_version.id = reqn_version_data_option.reqn_version_id 
      JOIN data_option ON reqn_version_data_option.data_option_id = data_option.id 
      JOIN data_option_category ON data_option.data_option_category_id = data_option_category.id
      SET reqn.data_sharing_approved = IF(
        "Data Release" = stage_type.name OR "Active" = stage_type.name,
        true,
        IF( reqn_version.data_sharing_filename IS NULL, NULL, false )
      )
      WHERE data_option_category.name_en = "Linked Data";
    END IF;

    SELECT "Adding new deferral_note_report* columns to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_report1";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN deferral_note_report3 TEXT NULL DEFAULT NULL AFTER deferral_note_2e;
      ALTER TABLE reqn ADD COLUMN deferral_note_report2 TEXT NULL DEFAULT NULL AFTER deferral_note_2e;
      ALTER TABLE reqn ADD COLUMN deferral_note_report1 TEXT NULL DEFAULT NULL AFTER deferral_note_2e;
    END IF;

    SELECT "Adding new deferral_note_2f columns to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2f";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN deferral_note_2f TEXT NULL DEFAULT NULL AFTER deferral_note_2e;
    END IF;

    SELECT "Adding new deferral_note_2g columns to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2g";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN deferral_note_2g TEXT NULL DEFAULT NULL AFTER deferral_note_2f;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;

SELECT "Adding triggers to reqn table" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS reqn_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_AFTER_INSERT AFTER INSERT ON reqn FOR EACH ROW
BEGIN
  CALL update_reqn_last_ethics_approval( NEW.id );
  CALL update_reqn_current_final_report( NEW.id );
END$$

DELIMITER ;
