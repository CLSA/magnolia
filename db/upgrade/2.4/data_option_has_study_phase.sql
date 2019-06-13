DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
DELIMITER //
CREATE PROCEDURE patch_data_option_has_study_phase()
  BEGIN

    SELECT "Adding baseline study phase to epigenetic data option" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "WHERE data_option.name_en = 'Epigenetics (N= ~1,488)' ",
      "AND study_phase.name = 'Baseline'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_data_option_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
