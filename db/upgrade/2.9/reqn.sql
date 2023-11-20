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

    SELECT "Adding deferral_note_destruction column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_destruction";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN deferral_note_destruction TEXT NULL DEFAULT NULL AFTER deferral_note_report3;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
