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

    SELECT "Creating new data_selection table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS data_selection ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "data_option_id INT(10) UNSIGNED NOT NULL, ",
        "study_phase_id INT(10) UNSIGNED NOT NULL, ",
        "cost INT(10) UNSIGNED NOT NULL DEFAULT 0, ",
        "unavailable_en VARCHAR(255) NULL DEFAULT NULL, ",
        "unavailable_fr VARCHAR(255) NULL DEFAULT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_data_option_id (data_option_id ASC), ",
        "INDEX fk_study_phase_id (study_phase_id ASC), ",
        "UNIQUE INDEX uq_data_option_id_study_phase_id (data_option_id ASC, study_phase_id ASC), ",
        "CONSTRAINT fk_data_selection_data_option_id ",
          "FOREIGN KEY (data_option_id) ",
          "REFERENCES data_option (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_data_selection_study_phase_id ",
          "FOREIGN KEY (study_phase_id) ",
          "REFERENCES ", @cenozo, ".study_phase (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SELECT COUNT(*) INTO @test FROM data_selection;

    IF 0 = @test THEN
      SELECT "Populating new data_selection table" AS "";

      SET @sql = CONCAT(
        "INSERT INTO data_selection( data_option_id, study_phase_id, unavailable_en, unavailable_fr ) ",
        "SELECT data_option.id, ",
               "study_phase.id, ",
               "IF( data_option_has_study_phase.study_phase_id IS NOT NULL, NULL, ",
               "IF( data_option.name_en RLIKE 'Genomics\|Epigenetics\|Metabolomics', '(not applicable)', '(not yet available)' ) ), ",
               "IF( data_option_has_study_phase.study_phase_id IS NOT NULL, NULL, ",
               "IF( data_option.name_en RLIKE 'Genomics\|Epigenetics\|Metabolomics', '(sans objet)', '(pas encore disponible)' ) ) ",
        "FROM data_option ",
        "JOIN data_option_category ON data_option.data_option_category_id = data_option_category.id ",
        "JOIN data_option_category_has_study_phase ",
          "ON data_option_category.id = data_option_category_has_study_phase.data_option_category_id ",
        "JOIN ", @cenozo, ".study_phase ON data_option_category_has_study_phase.study_phase_id = study_phase.id ",
        "LEFT JOIN data_option_has_study_phase ",
               "ON data_option.id = data_option_has_study_phase.data_option_id ",
               "AND study_phase.id = data_option_has_study_phase.study_phase_id"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      DROP TABLE data_option_has_study_phase;

      UPDATE data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      SET data_selection.cost = 500
      WHERE data_option.name_en IN(
        "cIMT Still image", "DXA Forearm", "DXA Hip", "DXA Whole Body", "DXA IVA Lateral Spine",
        "ECG RAW+", "ECG Images", "Retinal Scan (Image)", "Spirometry RAW+", "Spirometry Images" 
      );
      UPDATE data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      SET cost = 3000
      WHERE data_option.name_en = "cIMT Cineloops";
    END IF;

  END //
DELIMITER ;

CALL patch_data_selection();
DROP PROCEDURE IF EXISTS patch_data_selection;
