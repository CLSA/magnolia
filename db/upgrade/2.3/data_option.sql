DROP PROCEDURE IF EXISTS set_data_option_id;
DELIMITER //
CREATE PROCEDURE set_data_option_id( old_id INT UNSIGNED, new_id INT UNSIGNED )
  BEGIN
    UPDATE data_option_detail SET data_option_id = new_id WHERE data_option_id = old_id;
    UPDATE data_option_has_footnote SET data_option_id = new_id WHERE data_option_id = old_id;
    UPDATE data_option_has_study_phase SET data_option_id = new_id WHERE data_option_id = old_id;
    UPDATE reqn_data_option SET data_option_id = new_id WHERE data_option_id = old_id;
    UPDATE data_option SET id = new_id WHERE id = old_id;
  END //
DELIMITER ;

DROP PROCEDURE IF EXISTS delete_data_option;
DELIMITER //
CREATE PROCEDURE delete_data_option( name VARCHAR(127) )
  BEGIN

    SELECT id, data_option_category_id INTO @id, @data_option_category_id FROM data_option WHERE name_en = name;

    IF @id IS NOT NULL THEN
      -- delete the data-option
      DELETE FROM data_option WHERE id = @id;

      -- lower the ID of all other data options which come after the deleted data-option by one
      SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
      SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

      UPDATE data_option SET rank = rank-1 WHERE id > @id AND data_option_category_id = @data_option_category_id;
      SET @cid = @id+1;
      SET @max_id = ( SELECT MAX( id ) FROM data_option );
      WHILE @cid <= @max_id DO
        CALL set_data_option_id( @cid, @cid - 1 );
        SET @cid = @cid + 1;
      END WHILE;

      SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
      SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

    END IF;

  END //
DELIMITER ;

DROP PROCEDURE IF EXISTS patch_data_option;
DELIMITER //
CREATE PROCEDURE patch_data_option()
  BEGIN

    SET SESSION group_concat_max_len = 1000000;

    SELECT "Adding new note_en columns to the data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "note_en";

    IF @test = 0 THEN
      ALTER TABLE data_option ADD COLUMN note_en TEXT NULL DEFAULT NULL;

      UPDATE data_option
      JOIN (
        SELECT data_option.id, REPLACE( GROUP_CONCAT( footnote.note_en order by footnote.id separator "\n" ), "<br>", "\n" ) AS note_en
        FROM data_option
        JOIN data_option_has_footnote ON data_option.id = data_option_has_footnote.data_option_id
        JOIN footnote ON data_option_has_footnote.footnote_id = footnote.id
        GROUP BY data_option.id
      ) AS note USING( id )
      SET data_option.note_en = note.note_en;
    END IF;

    SELECT "Adding new note_fr columns to the data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "note_fr";

    IF @test = 0 THEN
      ALTER TABLE data_option ADD COLUMN note_fr TEXT NULL DEFAULT NULL;

      UPDATE data_option
      JOIN (
        SELECT data_option.id, REPLACE( GROUP_CONCAT( footnote.note_fr order by footnote.id separator "\n" ), "<br>", "\n" ) AS note_fr
        FROM data_option
        JOIN data_option_has_footnote ON data_option.id = data_option_has_footnote.data_option_id
        JOIN footnote ON data_option_has_footnote.footnote_id = footnote.id
        GROUP BY data_option.id
      ) AS note USING( id )
      SET data_option.note_fr = note.note_fr;
    END IF;

  END //
DELIMITER ;

CALL patch_data_option();
DROP PROCEDURE IF EXISTS patch_data_option;

SELECT "Removing defunct data_option records" AS "";
CALL delete_data_option( "Self-reported Chronic Conditions" );
CALL delete_data_option( "Bio-Impedance by DEXA" );
CALL delete_data_option( "Bone Density by DEXA" );
DROP PROCEDURE delete_data_option;
DROP PROCEDURE set_data_option_id;
