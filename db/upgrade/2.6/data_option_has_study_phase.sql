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

    SELECT "Adding baseline and f1 study phase to medications data option" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option CROSS JOIN ", @cenozo, ".study ",
      "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
      "WHERE data_option.name_en = 'Medications' ",
      "AND study.name = 'CLSA' "
      "AND study_phase.name = 'Baseline'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SELECT "Adding baseline and f1 study phase to additional-data data option" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option_category ",
      "CROSS JOIN ", @cenozo, ".study ",
      "JOIN data_option ON data_option_category.id = data_option.data_option_category_id ",
      "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
      "WHERE data_option_category.name_en IN( 'Additional Data', 'Geographic Indicators' ) ",
      "AND study.name = 'CLSA' ",
      "AND study_phase.name IN( 'Baseline', 'Follow-up 1' )"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SELECT "Adding baseline study phase to covid-19 data option" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option_category ",
      "CROSS JOIN ", @cenozo, ".study ",
      "JOIN data_option ON data_option_category.id = data_option.data_option_category_id ",
      "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
      "WHERE data_option_category.name_en = 'COVID-19 Data' ",
      "AND study.name = 'COVID-19 Questionnaire' ",
      "AND study_phase.name = 'Baseline'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_data_option_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
