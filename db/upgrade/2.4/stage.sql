SELECT "Updating stage INSERT and DELETE triggers" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS stage_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_INSERT AFTER INSERT ON stage FOR EACH ROW
BEGIN
  -- create any review associated with the stage_type
  INSERT IGNORE INTO review( create_timestamp, reqn_id, amendment, review_type_id )
  SELECT NULL, NEW.reqn_id, reqn_version.amendment, review_type.id
  FROM review_type
  JOIN stage_type ON review_type.stage_type_id = stage_type.id
  JOIN reqn_current_reqn_version ON NEW.reqn_id = reqn_current_reqn_version.reqn_id
  JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
  WHERE stage_type.id = NEW.stage_type_id;

  -- create the final report if we just created the report required stage
  SELECT name INTO @stage_type FROM stage_type WHERE id = NEW.stage_type_id;
  IF @stage_type = "Report Required" THEN
    INSERT IGNORE INTO final_report( create_timestamp, reqn_id )
    SELECT NULL, NEW.reqn_id;
  END IF;
END$$

DROP TRIGGER IF EXISTS stage_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_DELETE AFTER DELETE ON stage FOR EACH ROW
BEGIN
  -- delete all reviews associated with the stage_type
  DELETE FROM review
  WHERE review_type_id IN (
    SELECT review_type.id
    FROM review_type
    JOIN stage_type ON review_type.stage_type_id = stage_type.id
    WHERE stage_type.id = OLD.stage_type_id
  ) AND amendment = (
    SELECT amendment
    FROM reqn_current_reqn_version
    JOIN reqn_version ON reqn_current_reqn_version.reqn_version = reqn_version.id
    WHERE reqn_current_reqn_version.reqn_id = OLD.reqn_id
  );
END$$

DELIMITER ;
