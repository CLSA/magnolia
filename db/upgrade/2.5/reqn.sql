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

    SELECT "Adding 'inactive' option to state enum in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "state"
    AND column_type LIKE "%'inactive'%";

    IF @test = 0 THEN
      ALTER TABLE reqn MODIFY COLUMN state ENUM('deferred', 'inactive', 'abandoned') NULL DEFAULT NULL;
    END IF;

    SELECT "Adding new website column to the reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "website";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN website TINYINT(1) NOT NULL DEFAULT 0 AFTER state_date;
    END IF;

    SELECT "Replacing graduate_id with trainee_user_id column in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_id";

    IF @test = 1 THEN
      ALTER TABLE reqn ADD COLUMN trainee_user_id INT UNSIGNED NULL DEFAULT NULL AFTER user_id;
      ALTER TABLE reqn ADD INDEX fk_trainee_user_id (trainee_user_id ASC);

      SET @sql = CONCAT(
        "ALTER TABLE reqn ADD CONSTRAINT fk_reqn_trainee_user_id ",
        "FOREIGN KEY (trainee_user_id) ",
        "REFERENCES ", @cenozo, ".user (id) ",
        "ON DELETE NO ACTION ",
        "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      UPDATE reqn
      JOIN graduate ON reqn.graduate_id = graduate.id
      SET reqn.trainee_user_id = graduate.graduate_user_id;

      ALTER TABLE reqn DROP FOREIGN KEY fk_graduate_id;
      ALTER TABLE reqn DROP INDEX fk_graduate_id;
      ALTER TABLE reqn DROP COLUMN graduate_id;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
