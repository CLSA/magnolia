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

    SELECT "Updating waiver in reqn_version table with new options" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "waiver"
    AND column_type = "enum('graduate','postdoc')";

    IF @test = 1 THEN
      ALTER TABLE reqn_version MODIFY COLUMN waiver ENUM('graduate', 'postdoc', 'clinical', 'none') NULL DEFAULT NULL;

      -- By default, all reqns except for those in the new stage get waiver = no
      UPDATE reqn_version
      JOIN reqn ON reqn_version.reqn_id = reqn.id
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      SET waiver = 'none'
      WHERE stage_type.name != "New"
      AND waiver IS NULL;
    END IF;

    SELECT "Adding indigenous column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous TINYINT(1) NULL DEFAULT NULL AFTER last_identifier;

      -- When first deployed make sure all reqns have this new property set to false
      UPDATE reqn_version SET indigenous = false;
    END IF;

    SELECT "Adding indigenous_description column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous_description";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous_description TEXT NULL DEFAULT NULL AFTER indigenous;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;


SELECT "Modifying triggers in the reqn_version table" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS reqn_version_BEFORE_UPDATE$$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_BEFORE_UPDATE BEFORE UPDATE ON reqn_version FOR EACH ROW
BEGIN
  IF NOT NEW.indigenous THEN
    SET NEW.indigenous_description = NULL;
  END IF;
END$$

DELIMITER ;
