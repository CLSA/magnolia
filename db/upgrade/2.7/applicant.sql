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

    SELECT "Changing foreign key on delete action in applicant table" AS "";

    ALTER TABLE applicant DROP CONSTRAINT fk_applicant_supervisor_user_id,
                          DROP CONSTRAINT fk_applicant_user_id;

    SET @sql = CONCAT(
      "ALTER TABLE applicant ",
      "ADD CONSTRAINT fk_applicant_supervisor_user_id ",
        "FOREIGN KEY (supervisor_user_id) ",
        "REFERENCES ", @cenozo, ".user (id) ",
        "ON DELETE CASCADE ",
        "ON UPDATE NO ACTION, ",
      "ADD CONSTRAINT fk_applicant_user_id ",
        "FOREIGN KEY (user_id) ",
        "REFERENCES ", @cenozo, ".user (id) ",
        "ON DELETE CASCADE ",
        "ON UPDATE NO ACTION"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_applicant();
DROP PROCEDURE IF EXISTS patch_applicant;
