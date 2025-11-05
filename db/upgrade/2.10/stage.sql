DROP PROCEDURE IF EXISTS patch_stage;
DELIMITER //
CREATE PROCEDURE patch_stage()
  BEGIN

    SELECT "Replacing amendment with amendment_id column in stage table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "stage"
    AND column_name = "amendment_id";

    IF @test = 0 THEN
      ALTER TABLE stage ADD COLUMN amendment_id INT UNSIGNED NOT NULL AFTER amendment;

      UPDATE stage
      JOIN amendment ON stage.reqn_id = amendment.reqn_id AND stage.amendment = amendment.name
      SET stage.amendment_id = amendment.id;

      ALTER TABLE stage ADD INDEX fk_amendment_id (amendment_id ASC);
      ALTER TABLE stage ADD CONSTRAINT fk_stage_amendment_id
        FOREIGN KEY (amendment_id)
        REFERENCES amendment (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

      ALTER TABLE stage
        DROP INDEX uq_reqn_id_amendment_stage_type_id,
        DROP COLUMN amendment;
    END IF;

  END //
DELIMITER ;

CALL patch_stage();
DROP PROCEDURE IF EXISTS patch_stage;


DELIMITER $$

DROP TRIGGER IF EXISTS stage_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER stage_AFTER_INSERT AFTER INSERT ON stage FOR EACH ROW
BEGIN
  INSERT IGNORE INTO review( reqn_id, amendment_id, review_type_id )
  SELECT NEW.reqn_id, reqn_version.amendment_id, review_type.id
  FROM review_type
  JOIN stage_type ON review_type.stage_type_id = stage_type.id
  JOIN reqn_current_reqn_version ON NEW.reqn_id = reqn_current_reqn_version.reqn_id
  JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
  WHERE stage_type.id = NEW.stage_type_id;
END$$

DROP TRIGGER IF EXISTS stage_AFTER_DELETE$$
CREATE DEFINER=CURRENT_USER TRIGGER stage_AFTER_DELETE AFTER DELETE ON stage FOR EACH ROW
BEGIN
  DELETE FROM review
  WHERE review_type_id IN (
    SELECT review_type.id
    FROM review_type
    JOIN stage_type ON review_type.stage_type_id = stage_type.id
    WHERE stage_type.id = OLD.stage_type_id
  ) AND amendment_id = (
    SELECT amendment_id
    FROM reqn_current_reqn_version
    JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
    WHERE reqn_current_reqn_version.reqn_id = OLD.reqn_id
  )
  AND reqn_id = OLD.reqn_id;
END$$

DELIMITER ;
