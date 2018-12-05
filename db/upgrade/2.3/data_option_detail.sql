DROP PROCEDURE IF EXISTS patch_data_option_detail;
DELIMITER //
CREATE PROCEDURE patch_data_option_detail()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SET SESSION group_concat_max_len = 1000000;

    SELECT "Adding new note_en columns to the data_option_detail table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_detail"
    AND column_name = "note_en";

    IF @test = 0 THEN
      ALTER TABLE data_option_detail ADD COLUMN note_en TEXT NULL DEFAULT NULL;

      UPDATE data_option_detail
      JOIN (
        SELECT data_option_detail.id, REPLACE( GROUP_CONCAT( footnote.note_en order by footnote.id separator "\n" ), "<br>", "\n" ) AS note_en
        FROM data_option_detail
        JOIN data_option_detail_has_footnote ON data_option_detail.id = data_option_detail_has_footnote.data_option_detail_id
        JOIN footnote ON data_option_detail_has_footnote.footnote_id = footnote.id
        GROUP BY data_option_detail.id
      ) AS note USING( id )
      SET data_option_detail.note_en = note.note_en;
    END IF;

    SELECT "Adding new note_fr columns to the data_option_detail table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_detail"
    AND column_name = "note_fr";

    IF @test = 0 THEN
      ALTER TABLE data_option_detail ADD COLUMN note_fr TEXT NULL DEFAULT NULL;

      UPDATE data_option_detail
      JOIN (
        SELECT data_option_detail.id, REPLACE( GROUP_CONCAT( footnote.note_fr order by footnote.id separator "\n" ), "<br>", "\n" ) AS note_fr
        FROM data_option_detail
        JOIN data_option_detail_has_footnote ON data_option_detail.id = data_option_detail_has_footnote.data_option_detail_id
        JOIN footnote ON data_option_detail_has_footnote.footnote_id = footnote.id
        GROUP BY data_option_detail.id
      ) AS note USING( id )
      SET data_option_detail.note_fr = note.note_fr;
    END IF;

    SELECT "Adding new study_phase_id columns to the data_option_detail table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_detail"
    AND column_name = "study_phase_id";

    IF @test = 0 THEN
      CREATE TEMPORARY TABLE temp1
      SELECT data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr
      FROM data_option_detail
      JOIN data_option_detail_has_study_phase ON data_option_detail.id = data_option_detail_has_study_phase.data_option_detail_id
      ORDER BY data_option_id, study_phase_id, rank;

      SET @last = NULL, @rank = 0;
      CREATE TEMPORARY TABLE temp_data_option_detail
      SELECT data_option_id, study_phase_id, name_en, name_fr, note_en, note_fr,
             @rank := IF( @last = CONCAT( data_option_id, "-", study_phase_id ), @rank+1, 1 ) AS rank,
             @last := CONCAT( data_option_id, "-", study_phase_id ) AS last
      FROM temp1
      ORDER BY data_option_id, study_phase_id, rank;

      DELETE FROM data_option_detail_has_study_phase;
      DELETE FROM data_option_detail;

      SET @sql = CONCAT(
        "ALTER TABLE data_option_detail ",
        "ADD COLUMN study_phase_id INT UNSIGNED NOT NULL AFTER data_option_id, ",
        "DROP KEY uq_data_option_id_rank, ",
        "ADD UNIQUE KEY uq_data_option_id_study_phase_id_rank (data_option_id ASC, study_phase_id ASC, rank ASC), ",
        "ADD INDEX fk_study_phase_id (study_phase_id ASC), ",
        "ADD CONSTRAINT fk_data_option_detail_study_phase_id ",
          "FOREIGN KEY (study_phase_id) ",
          "REFERENCES ", @cenozo, ".study_phase (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION" );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr )
      SELECT data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr
      FROM temp_data_option_detail;

    END IF;

  END //
DELIMITER ;

CALL patch_data_option_detail();
DROP PROCEDURE IF EXISTS patch_data_option_detail;
