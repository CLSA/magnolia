

DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
DELIMITER //
CREATE PROCEDURE patch_data_option_has_study_phase()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding study-phases to new cognition data-option" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option, ", @cenozo, ".study ",
      "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
      "WHERE data_option.name_en = 'Cognition (Raw data)' ",
      "AND study.name = 'CLSA' "
      "AND study_phase.rank IN ( 1, 2 )"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_data_option_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
