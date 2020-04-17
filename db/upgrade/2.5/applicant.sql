DROP PROCEDURE IF EXISTS patch_applicant;
DELIMITER //
CREATE PROCEDURE patch_applicant()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding new supervisor_user_id column to applicant table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "applicant"
    AND column_name = "supervisor_user_id";

    IF @test = 0 THEN
      ALTER TABLE applicant ADD COLUMN supervisor_user_id INT UNSIGNED NULL DEFAULT NULL AFTER user_id;
      ALTER TABLE applicant ADD INDEX fk_supervisor_user_id (supervisor_user_id ASC);

      SET @sql = CONCAT(
        "ALTER TABLE applicant ADD CONSTRAINT fk_applicant_supervisor_user_id ",
        "FOREIGN KEY (supervisor_user_id) ",
        "REFERENCES ", @cenozo, ".user (id) ",
        "ON DELETE NO ACTION ",
        "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT IGNORE INTO applicant( user_id ) ",
        "SELECT user_id ",
        "FROM access ",
        "JOIN ", @cenozo, ".role ON access.role_id = role.id ",
        "WHERE role.name = 'applicant'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT IGNORE INTO applicant( user_id ) ",
        "SELECT DISTINCT user_id FROM reqn"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      -- copy supervisors from graduate table
      UPDATE applicant
      JOIN graduate ON applicant.user_id = graduate.graduate_user_id
      SET applicant.supervisor_user_id = graduate.user_id;
    END IF;

  END //
DELIMITER ;

CALL patch_applicant();
DROP PROCEDURE IF EXISTS patch_applicant;
