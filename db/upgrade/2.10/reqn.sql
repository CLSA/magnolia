DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    SELECT "Reordering columns in reqn table" As "";

    ALTER TABLE reqn
    MODIFY COLUMN state ENUM('deferred', 'inactive', 'abandoned') NULL DEFAULT NULL AFTER identifier;
    ALTER TABLE reqn MODIFY COLUMN state_date DATE NULL DEFAULT NULL AFTER state;
    ALTER TABLE reqn MODIFY COLUMN legacy TINYINT(1) NOT NULL DEFAULT 0 AFTER website;
    ALTER TABLE reqn MODIFY COLUMN suggested_revisions TINYINT(1) NOT NULL DEFAULT 0 AFTER legacy;
    ALTER TABLE reqn MODIFY COLUMN non_payment TINYINT(1) NOT NULL DEFAULT 0 AFTER suggested_revisions;
    ALTER TABLE reqn MODIFY COLUMN disable_notification TINYINT(1) NOT NULL DEFAULT 0 AFTER non_payment;
    ALTER TABLE reqn MODIFY COLUMN show_prices TINYINT(1) NOT NULL DEFAULT 1 AFTER disable_notification;
    ALTER TABLE reqn MODIFY COLUMN data_sharing_approved TINYINT(1) NULL DEFAULT NULL AFTER show_prices;

    SELECT "Adding new cross_institution_data_access column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "cross_institution_data_access";

    IF @test = 0 THEN
      ALTER TABLE reqn
      ADD COLUMN cross_institution_data_access TINYINT(1) NOT NULL DEFAULT 1
      AFTER data_sharing_approved;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "override_price";

    IF @test = 1 THEN
      ALTER TABLE reqn DROP COLUMN override_price;
    END IF;

    SELECT "Moving reqn.instruction_filename data to reqn_document table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "instruction_filename";

    IF @test = 1 THEN
      INSERT INTO reqn_document (reqn_id, filename, data)
      -- data column filled out in move_data_instruction.php script
      SELECT id, instruction_filename, "TEMP" FROM reqn WHERE instruction_filename IS NOT NULL;
      ALTER TABLE reqn DROP COLUMN instruction_filename;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
