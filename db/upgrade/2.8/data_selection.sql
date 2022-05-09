DROP PROCEDURE IF EXISTS patch_data_selection;
DELIMITER //
CREATE PROCEDURE patch_data_selection()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding follow-up 2 data selections" AS "";

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

    -- Available selections
    INSERT IGNORE INTO data_selection( data_option_id, study_phase_id )
    SELECT id, @study_phase_id
    FROM data_option
    WHERE name_en IN( "Questionnaire Data", "FSA", "CSD" );

    -- Not applicable selections
    INSERT IGNORE INTO data_selection( data_option_id, study_phase_id, unavailable_en, unavailable_fr )
    SELECT id, @study_phase_id, "(not applicable)", "(sans objet)"
    FROM data_option
    WHERE name_en LIKE "Genomics%"
    OR name_en LIKE "Epigenetics%"
    OR name_en LIKE "Metabolomics%";

    -- Not yet available selections (all other options except for the COVID-19 Data)
    INSERT IGNORE INTO data_selection( data_option_id, study_phase_id, unavailable_en, unavailable_fr )
    SELECT data_option.id, @study_phase_id, "(not yet available)", "(pas encore disponible)"
    FROM data_option
    JOIN data_category ON data_option.data_category_id = data_category.id
    WHERE data_category.name_en != "COVID-19 Data";

    -- Set selections with costs > 0
    UPDATE data_selection
    JOIN data_option ON data_selection.data_option_id = data_option.id
    SET cost = 3000, cost_combined = true
    WHERE data_option.name_en = "cIMT Cineloops"
    AND study_phase_id = @study_phase_id;

    -- Set selections with costs > 0
    UPDATE data_selection
    SET cost = 500
    WHERE data_option_id IN (
      SELECT DISTINCT data_option_id FROM data_selection where cost = 500
    )
    AND study_phase_id = @study_phase_id;

  END //
DELIMITER ;

CALL patch_data_selection();
DROP PROCEDURE IF EXISTS patch_data_selection;
