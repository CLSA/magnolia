-- procedure used by patch_data_option_has_study_phase
DROP PROCEDURE IF EXISTS set_study_phase;
DELIMITER //
CREATE PROCEDURE set_study_phase( name VARCHAR(127), phase VARCHAR(45) )
  BEGIN
    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
      "SELECT data_option.id, study_phase.id ",
      "FROM data_option, ", @cenozo, ".study_phase ",
      "WHERE data_option.name_en = '", name, "' ",
      "AND ( ",
        "( '", phase, "' = 'all' AND study_phase.name != 'Follow-up 2' ) OR ",
        "study_phase.name = '", phase, "' ",
      ")" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
  END //
DELIMITER ;

DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
DELIMITER //
CREATE PROCEDURE patch_data_option_has_study_phase()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new data_option_has_study_phase table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS data_option_has_study_phase ( ",
        "data_option_id INT UNSIGNED NOT NULL, ",
        "study_phase_id INT UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "PRIMARY KEY (data_option_id, study_phase_id), ",
        "INDEX fk_study_phase_id (study_phase_id ASC), ",
        "INDEX fk_data_option_id (data_option_id ASC), ",
        "CONSTRAINT fk_data_option_has_study_phase_data_option_id ",
          "FOREIGN KEY (data_option_id) ",
          "REFERENCES data_option (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE, ",
        "CONSTRAINT fk_data_option_has_study_phase_study_phase_id ",
          "FOREIGN KEY (study_phase_id) ",
          "REFERENCES ", @cenozo, ".study_phase (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    -- QUESTIONNAIRE DATA OPTION DETAILS
    CALL set_study_phase( "Socio-Demographic Characteristics", "all" );
    CALL set_study_phase( "Lifestyle and Behaviour", "all" );
    CALL set_study_phase( "Physical Health I", "all" );
    CALL set_study_phase( "Physical Health II", "all" );
    CALL set_study_phase( "Psychological Health", "all" );
    CALL set_study_phase( "Cognition - metadata & scores", "all" );
    CALL set_study_phase( "Labour Force", "all" );
    CALL set_study_phase( "Social Health", "all" );
    
    -- PHYSICAL ASSESSMENT DATA OPTION DETAILS
    CALL set_study_phase( "Physical Assessments I", "all" );
    CALL set_study_phase( "Bio-Impedance by DEXA", "all" );
    CALL set_study_phase( "Physical Assessments II", "all" );
    CALL set_study_phase( "Bone Density by DEXA", "all" );
    
    -- BIOMARKER DATA OPTION DETAILS
    CALL set_study_phase( "Hematology Report", "Baseline" );
    CALL set_study_phase( "Chemistry Report", "Baseline" );
    
    -- GENOMIC DATA OPTION DETAILS
    CALL set_study_phase( "Genomics (N=9,896)", "Baseline" );

    -- LINKED DATA DATA OPTION DETAILS
    CALL set_study_phase( "Air Quality", "Baseline" );
    CALL set_study_phase( "Neighborhood Factors", "Baseline" );
    CALL set_study_phase( "Greenness & Weather", "Baseline" );

  END //
DELIMITER ;

CALL patch_data_option_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_option_has_study_phase;
DROP PROCEDURE IF EXISTS set_study_phase;
