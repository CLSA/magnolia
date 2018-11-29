DROP PROCEDURE IF EXISTS patch_reqn_has_data_option;
DELIMITER //
CREATE PROCEDURE patch_reqn_has_data_option()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Removing old reqn_has_data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_has_data_option";
    IF @test THEN
      -- transfer data to new reqn_data_option table
      SET @sql = CONCAT(
        "INSERT INTO reqn_data_option( reqn_id, data_option_id, study_phase_id ) ",
        "SELECT DISTINCT reqn_id, data_option_id, study_phase.id ",
        "FROM reqn_has_data_option, ", @cenozo, ".study_phase ",
        "WHERE study_phase.name = 'Baseline'" );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      -- now drop the table
      DROP TABLE reqn_has_data_option;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_has_data_option();
DROP PROCEDURE IF EXISTS patch_reqn_has_data_option;
