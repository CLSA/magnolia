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

    SELECT "Adding designate_user_id column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "designate_user_id";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN designate_user_id INT UNSIGNED NULL DEFAULT NULL AFTER trainee_user_id;
      ALTER TABLE reqn ADD INDEX fk_designate_user_id (designate_user_id ASC);

      SET @sql = CONCAT(
        "ALTER TABLE reqn ADD CONSTRAINT fk_reqn_designate_user_id ",
        "FOREIGN KEY (designate_user_id) ",
        "REFERENCES ", @cenozo, ".user (id) ",
        "ON DELETE NO ACTION ",
        "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

    SELECT "Adding disable_notification column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "disable_notification";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN disable_notification TINYINT(1) NOT NULL DEFAULT 0 AFTER reqn_type_id;
      UPDATE reqn SET disable_notification = true WHERE legacy = true;
    END IF;

    SELECT "Adding show_prices column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "show_prices";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN show_prices TINYINT(1) NOT NULL DEFAULT 1 AFTER legacy;

      -- start with all reqns not showing prices
      UPDATE reqn SET show_prices = 0;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
