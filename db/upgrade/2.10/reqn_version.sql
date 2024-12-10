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

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
