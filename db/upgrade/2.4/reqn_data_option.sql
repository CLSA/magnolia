DROP PROCEDURE IF EXISTS patch_reqn_data_option;
DELIMITER //
CREATE PROCEDURE patch_reqn_data_option()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Renaming reqn_data_option to reqn_version_data_option" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_data_option";

    IF @test THEN
      
      RENAME TABLE reqn_data_option TO reqn_version_data_option;

      SET @sql = CONCAT(
        "ALTER TABLE reqn_version_data_option ",
        "DROP FOREIGN KEY fk_reqn_data_option_data_option_id, ",
        "ADD CONSTRAINT fk_reqn_version_data_option_data_option_id ",
        "FOREIGN KEY (data_option_id) ",
        "REFERENCES data_option (id) ",
        "ON DELETE CASCADE ",
        "ON UPDATE CASCADE, ",
        "DROP FOREIGN KEY fk_reqn_data_option_study_phase_id, ",
        "ADD CONSTRAINT fk_reqn_version_data_option_study_phase_id ",
        "FOREIGN KEY (study_phase_id) ",
        "REFERENCES ", @cenozo, ".study_phase (id) ",
        "ON DELETE CASCADE ",
        "ON UPDATE CASCADE" );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

    END IF;

    SELECT "Changing foreign key in reqn_version_data_option table from reqn to reqn_version" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version_data_option"
    AND column_name = "reqn_id";

    IF @test THEN

      ALTER TABLE reqn_version_data_option
      ADD COLUMN reqn_version_id INT UNSIGNED NOT NULL AFTER reqn_id,
      ADD INDEX fk_reqn_version_id (reqn_version_id ASC);

      UPDATE reqn_version_data_option
      JOIN reqn ON reqn_version_data_option.reqn_id = reqn.id
      JOIN reqn_current_reqn_version ON reqn.id = reqn_current_reqn_version.reqn_id
      SET reqn_version_data_option.reqn_version_id = reqn_current_reqn_version.reqn_version_id;

      ALTER TABLE reqn_version_data_option
      ADD UNIQUE INDEX uq_reqn_version_id_data_option_id_study_phase_id (reqn_version_id ASC, data_option_id ASC, study_phase_id ASC),
      ADD CONSTRAINT fk_reqn_version_data_option_reqn_version_id
      FOREIGN KEY (reqn_version_id)
      REFERENCES reqn_version (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

      ALTER TABLE reqn_version_data_option
      DROP INDEX uq_reqn_id_data_option_id_study_phase_id,
      DROP FOREIGN KEY fk_reqn_data_option_reqn_id,
      DROP INDEX fk_reqn_id,
      DROP COLUMN reqn_id;

    END IF;

  END //
DELIMITER ;

CALL patch_reqn_data_option();
DROP PROCEDURE IF EXISTS patch_reqn_data_option;
