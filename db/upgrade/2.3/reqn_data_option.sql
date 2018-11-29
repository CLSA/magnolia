DROP PROCEDURE IF EXISTS patch_reqn_data_option;
DELIMITER //
CREATE PROCEDURE patch_reqn_data_option()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new reqn_data_option table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS reqn_data_option ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "reqn_id INT UNSIGNED NOT NULL, ",
        "data_option_id INT UNSIGNED NOT NULL, ",
        "study_phase_id INT UNSIGNED NOT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_reqn_id (reqn_id ASC), ",
        "INDEX fk_data_option_id (data_option_id ASC), ",
        "INDEX fk_study_phase_id (study_phase_id ASC), ",
        "UNIQUE INDEX uq_reqn_id_data_option_id_study_phase_id (reqn_id ASC, data_option_id ASC, study_phase_id ASC), ",
        "CONSTRAINT fk_reqn_data_option_reqn_id ",
          "FOREIGN KEY (reqn_id) ",
          "REFERENCES reqn (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE, ",
        "CONSTRAINT fk_reqn_data_option_data_option_id ",
          "FOREIGN KEY (data_option_id) ",
          "REFERENCES data_option (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE, ",
        "CONSTRAINT fk_reqn_data_option_study_phase_id ",
          "FOREIGN KEY (study_phase_id) ",
          "REFERENCES ", @cenozo, ".study_phase (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_reqn_data_option();
DROP PROCEDURE IF EXISTS patch_reqn_data_option;
