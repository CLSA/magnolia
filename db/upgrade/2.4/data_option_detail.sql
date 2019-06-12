DROP PROCEDURE IF EXISTS patch_data_option_detail;
DELIMITER //
CREATE PROCEDURE patch_data_option_detail()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Adding epigenetic data option details" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr ) ",
      "SELECT data_option.id, study_phase.id, 1,  ",
        "'Raw data, IDAT format (Illumina Infinium MethylationEPIC Beadchip, 850k probes)', ",
        "'Données brutes, format IDAT (Puce Illumina 850K Infinium MethylationEPIC BeadChip)' ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "WHERE data_option.name_en = 'Epigenetics (N= ~1,488)' ",
      "AND study_phase.name = 'Baseline'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr ) ",
      "SELECT data_option.id, study_phase.id, 2,  ",
        "'Raw data, CSV format (Beta values, no processing performed)', ",
        "'Données brutes, format .csv (valeurs bêta, aucun traitement)' ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "WHERE data_option.name_en = 'Epigenetics (N= ~1,488)' ",
      "AND study_phase.name = 'Baseline'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr ) ",
      "SELECT data_option.id, study_phase.id, 3,  ",
        "'Processed data, CSV format (Beta values, background corrected, normalized, and probe filtered)', ",
        "'Données traitées, format .csv (valeurs bêta, correction de fond, normalisées et filtrées)' ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "WHERE data_option.name_en = 'Epigenetics (N= ~1,488)' ",
      "AND study_phase.name = 'Baseline'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr ) ",
      "SELECT data_option.id, study_phase.id, 4,  ",
        "'DNA methylation age estimates, CSV format', ",
        "'Estimations d’âge selon la méthylation de l’ADN, format .csv' ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "WHERE data_option.name_en = 'Epigenetics (N= ~1,488)' ",
      "AND study_phase.name = 'Baseline'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_data_option_detail();
DROP PROCEDURE IF EXISTS patch_data_option_detail;
