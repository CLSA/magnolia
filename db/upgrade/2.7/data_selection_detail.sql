DROP PROCEDURE IF EXISTS patch_data_selection_detail;
DELIMITER //
CREATE PROCEDURE patch_data_selection_detail()
  BEGIN

    SELECT "Creating new data_selection_detail table" AS "";

    CREATE TABLE IF NOT EXISTS data_selection_detail (
      id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
      create_timestamp TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
      data_selection_id INT UNSIGNED NOT NULL,
      rank INT(10) UNSIGNED NOT NULL,
      name_en VARCHAR(127) NOT NULL,
      name_fr VARCHAR(127) NOT NULL,
      note_en TEXT NULL DEFAULT NULL,
      note_fr TEXT NULL DEFAULT NULL,
      PRIMARY KEY (id),
      INDEX fk_data_selection_id (data_selection_id ASC),
      UNIQUE INDEX uq_data_selection_id_rank (data_selection_id ASC, rank ASC),
      CONSTRAINT fk_data_selection_detail_data_selection_id
        FOREIGN KEY (data_selection_id)
        REFERENCES data_selection (id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION)
    ENGINE = InnoDB;

    SELECT COUNT(*) INTO @test FROM data_selection_detail;

    IF @test = 0 THEN
      SELECT "Populating data_selection_detail table" AS "";

      INSERT INTO data_selection_detail( data_selection_id, rank, name_en, name_fr, note_en, note_fr )
      SELECT data_selection.id, rank, name_en, name_fr, note_en, note_fr
      FROM data_option_detail
      JOIN data_selection USING( data_option_id, study_phase_id );

      DROP TABLE data_option_detail;
    END IF;

  END //
DELIMITER ;

CALL patch_data_selection_detail();
DROP PROCEDURE IF EXISTS patch_data_selection_detail;
