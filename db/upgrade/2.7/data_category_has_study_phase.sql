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

    SELECT "Creating new data_category_has_study_phase table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS data_category_has_study_phase ( ",
        "data_category_id INT(10) UNSIGNED NOT NULL, ",
        "study_phase_id INT(10) UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NULL, ",
        "create_timestamp TIMESTAMP NULL, ",
        "PRIMARY KEY (data_category_id, study_phase_id), ",
        "INDEX fk_study_phase_id (study_phase_id ASC), ",
        "INDEX fk_data_category_id (data_category_id ASC), ",
        "CONSTRAINT fk_data_category_has_study_phase_data_category_id ",
          "FOREIGN KEY (data_category_id) ",
          "REFERENCES data_category (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_data_category_has_study_phase_study_phase_id ",
          "FOREIGN KEY (study_phase_id) ",
          "REFERENCES ", @cenozo, ".study_phase (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SELECT COUNT(*) INTO @test FROM data_category_has_study_phase;

    IF 0 = @test THEN
      SELECT "Populating new data_category_has_study_phase table" AS "";

      INSERT INTO data_category_has_study_phase( data_category_id, study_phase_id )
      SELECT DISTINCT data_option_category_id, study_phase_id
      FROM data_option
      JOIN data_option_has_study_phase ON data_option.id = data_option_has_study_phase.data_option_id
      ORDER BY data_option_category_id, study_phase_id;

      SET @sql = CONCAT(
        "INSERT INTO data_category_has_study_phase( data_category_id, study_phase_id ) ",
        "SELECT data_category.id, study_phase.id ",
        "FROM data_category, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_category.name_en = 'Linked Data' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code = 'F1'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

  END //
DELIMITER ;

CALL patch_data_category_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_category_has_study_phase;
