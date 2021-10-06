DROP PROCEDURE IF EXISTS patch_reqn_version_has_data_selection;
DELIMITER //
CREATE PROCEDURE patch_reqn_version_has_data_selection()
  BEGIN

    SELECT "Creating new reqn_version_has_data_selection table" AS "";

    CREATE TABLE IF NOT EXISTS reqn_version_has_data_selection (
      reqn_version_id INT(10) UNSIGNED NOT NULL,
      data_selection_id INT UNSIGNED NOT NULL,
      update_timestamp TIMESTAMP NOT NULL,
      create_timestamp TIMESTAMP NOT NULL,
      PRIMARY KEY (reqn_version_id, data_selection_id),
      INDEX fk_data_selection_id (data_selection_id ASC),
      INDEX fk_reqn_version_id (reqn_version_id ASC),
      CONSTRAINT fk_reqn_version_has_data_selection_reqn_version_id
        FOREIGN KEY (reqn_version_id)
        REFERENCES reqn_version (id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
      CONSTRAINT fk_reqn_version_has_data_selection_data_selection_id
        FOREIGN KEY (data_selection_id)
        REFERENCES data_selection (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
    ENGINE = InnoDB;

    SELECT COUNT(*) INTO @test FROM reqn_version_has_data_selection;

    IF 0 = @test THEN
      SELECT "Populating reqn_version_has_data_selection table" AS "";

      INSERT INTO reqn_version_has_data_selection( reqn_version_id, data_selection_id )
      SELECT reqn_version_data_option.reqn_version_id, data_selection.id
      FROM reqn_version_data_option
      JOIN data_selection USING( data_option_id, study_phase_id );

      DROP TABLE reqn_version_data_option;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version_has_data_selection();
DROP PROCEDURE IF EXISTS patch_reqn_version_has_data_selection;


SELECT "Replacing reqn_version_data_option triggers with reqn_version_has_data_selection triggers" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS reqn_version_has_data_selection_AFTER_INSERT$$

CREATE TRIGGER reqn_version_has_data_selection_AFTER_INSERT AFTER INSERT ON reqn_version_has_data_selection FOR EACH ROW
BEGIN
  SELECT data_option_id INTO @data_option_id FROM data_selection WHERE id = NEW.data_selection_id;

  -- make sure the data_justification record exists
  INSERT IGNORE INTO data_justification
  SET reqn_version_id = NEW.reqn_version_id,
      data_option_id = @data_option_id;
END$$


DROP TRIGGER IF EXISTS reqn_version_has_data_selection_AFTER_DELETE$$

CREATE TRIGGER reqn_version_has_data_selection_AFTER_DELETE AFTER DELETE ON reqn_version_has_data_selection FOR EACH ROW
BEGIN
  SELECT data_option_id INTO @data_option_id FROM data_selection WHERE id = OLD.data_selection_id;

  -- remove the data_justification if this was the last selected data_option
  SELECT COUNT(*) INTO @count
  FROM reqn_version_has_data_selection
  JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
  WHERE reqn_version_id = OLD.reqn_version_id
  AND data_option_id = @data_option_id;

  IF 0 = @count THEN
    DELETE FROM data_justification
    WHERE reqn_version_id = OLD.reqn_version_id
    AND data_option_id = (
      SELECT data_option_id FROM data_selection WHERE id = OLD.data_selection_id
    );
  END IF;
END$$

DELIMITER ;
