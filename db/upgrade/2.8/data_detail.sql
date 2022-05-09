DROP PROCEDURE IF EXISTS patch_data_detail;
DELIMITER //
CREATE PROCEDURE patch_data_detail()
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

    SELECT data_selection.id INTO @data_selection_id
    FROM data_option
    JOIN data_selection ON data_option.id = data_selection.data_option_id
    WHERE data_option.name_en = "Questionnaire Data"
    AND data_selection.study_phase_id = @study_phase_id;

    INSERT IGNORE INTO data_detail( data_selection_id, rank, name_en, name_fr ) VALUES
    ( @data_selection_id, 1, "Socio-Demographic Characteristics", "Caractéristiques sociodémographiques" ),
    ( @data_selection_id, 2, "Lifestyle and Behaviour", "Style et vie et comportement" ),
    ( @data_selection_id, 3, "Physical Health", "Santé physique" ),
    ( @data_selection_id, 4, "Psychological Health", "Santé mentale" ),
    ( @data_selection_id, 5, "Labour Force", "Population active" ),
    ( @data_selection_id, 6, "Social Health", "Santé sociale" );

  END //
DELIMITER ;

CALL patch_data_detail();
DROP PROCEDURE IF EXISTS patch_data_detail;
