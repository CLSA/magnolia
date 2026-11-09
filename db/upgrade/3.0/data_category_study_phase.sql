DROP PROCEDURE IF EXISTS patch_data_category_study_phase;
DELIMITER //
CREATE PROCEDURE patch_data_category_study_phase()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "data_category_study_phase";

    IF @test = 0 THEN

      -- determine the @cenozo database name
      SET @cenozo = (
        SELECT unique_constraint_schema
        FROM information_schema.referential_constraints
        WHERE constraint_schema = DATABASE()
        AND constraint_name = "fk_access_site_id"
      );

      SELECT "Replacing data_category_has_study_phase with data_category_study_phase table" AS "";

      SET @sql = CONCAT(
        "CREATE TABLE data_category_study_phase ( ",
          "id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, ",
          "update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(), ",
          "create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), ",
          "data_category_id INT UNSIGNED NOT NULL, ",
          "study_phase_id INT(10) UNSIGNED NOT NULL, ",
          "cost_combined TINYINT(1) NOT NULL DEFAULT 0, ",
          "PRIMARY KEY (id), ",
          "INDEX fk_data_category_id (data_category_id ASC), ",
          "INDEX fk_study_phase_id (study_phase_id ASC), ",
          "UNIQUE INDEX uq_data_category_id_study_phase_id (data_category_id ASC, study_phase_id ASC), ",
          "CONSTRAINT fk_data_category_study_phase_data_category_id ",
            "FOREIGN KEY (data_category_id) ",
            "REFERENCES data_category (id) ",
            "ON DELETE CASCADE ",
            "ON UPDATE CASCADE, ",
          "CONSTRAINT fk_data_category_study_phase_study_phase_id ",
            "FOREIGN KEY (study_phase_id) ",
            "REFERENCES ", @cenozo, ".study_phase (id) ",
            "ON DELETE CASCADE ",
            "ON UPDATE CASCADE ",
        ") ENGINE = InnoDB"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      INSERT INTO data_category_study_phase(data_category_id, study_phase_id, cost_combined)
      SELECT data_category_id, study_phase_id, 0
      FROM data_category_has_study_phase;

      DROP TABLE data_category_has_study_phase;

    END IF;

  END //
DELIMITER ;

CALL patch_data_category_study_phase();
DROP PROCEDURE IF EXISTS patch_data_category_study_phase;
