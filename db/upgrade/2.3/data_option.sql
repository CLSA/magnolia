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

SELECT "Removing defunct data_option records" AS "";
CALL delete_data_option( "Self-reported Chronic Conditions" );
CALL delete_data_option( "Bio-Impedance by DEXA" );
CALL delete_data_option( "Bone Density by DEXA" );
DROP PROCEDURE delete_data_option;
DROP PROCEDURE set_data_option_id;
