DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
DELIMITER //
CREATE PROCEDURE patch_data_option_has_study_phase()
  BEGIN

    SELECT "Adding baseline and f1 study phase to medications data option" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "WHERE data_option.name_en = 'Medications' ",
      "AND study_phase.name IN( 'Baseline', 'Follow-up 1' ) " );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_data_option_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
