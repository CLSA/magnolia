DROP PROCEDURE IF EXISTS patch_data_category_has_study_phase;
DELIMITER //
CREATE PROCEDURE patch_data_category_has_study_phase()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding follow-up 2 to data categories" AS "";

    SET @sql = CONCAT(
      "SELECT study_phase.id INTO @study_phase_id ",
      "FROM ", @cenozo, ".study_phase ",
      "JOIN ", @cenozo, ".study ON study_phase.study_id = study.id "
      "WHERE study.name = 'CLSA' ",
      "AND study_phase.name = 'Follow-up 2'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    INSERT IGNORE INTO data_category_has_study_phase( data_category_id, study_phase_id )
    SELECT id, @study_phase_id
    FROM data_category
    WHERE name_en NOT IN( "COVID-19 Data", "Mortality Data" );

    SELECT "Adding baseline study phase to the new Mortality Data category" AS "";

    SET @sql = CONCAT(
      "SELECT study_phase.id INTO @study_phase_id ",
      "FROM ", @cenozo, ".study_phase ",
      "JOIN ", @cenozo, ".study ON study_phase.study_id = study.id "
      "WHERE study.name = 'CLSA' ",
      "AND study_phase.name = 'Baseline'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    INSERT IGNORE INTO data_category_has_study_phase( data_category_id, study_phase_id )
    SELECT data_category.id, @study_phase_id
    FROM data_category
    WHERE name_en = "Mortality Data";

  END //
DELIMITER ;

CALL patch_data_category_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_category_has_study_phase;
