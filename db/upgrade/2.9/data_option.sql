DROP PROCEDURE IF EXISTS patch_data_option;
DELIMITER //
CREATE PROCEDURE patch_data_option()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding new data-option" AS "";

    INSERT IGNORE INTO data_option ( data_category_id, rank, name_en, name_fr )
    SELECT data_category.id, 14, "Other", "Autre"
    FROM data_category
    WHERE name_en = "Images and Raw Data";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_selection( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "JOIN ", @cenozo, ".study ON study_phase.study_id = study.id ",
      "WHERE data_option.name_en = 'Other' ",
      "AND study.name = 'CLSA' ",
      "AND study_phase.rank = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
  
    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_selection( data_option_id, study_phase_id, unavailable_en, unavailable_fr ) ",
      "SELECT data_option.id, study_phase.id, '(not yet available)', '(pas encore disponible)' ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "JOIN ", @cenozo, ".study ON study_phase.study_id = study.id ",
      "WHERE data_option.name_en = 'Other' ",
      "AND study.name = 'CLSA' ",
      "AND study_phase.rank IN (2, 3)"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
  
  END //
DELIMITER ;

CALL patch_data_option();
DROP PROCEDURE IF EXISTS patch_data_option;
