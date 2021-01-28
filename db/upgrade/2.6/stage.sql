SELECT "Fixing bugs in stage_AFTER_INSERT and stage_AFTER_DELETE trigger" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS stage_AFTER_INSERT $$

CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_INSERT AFTER INSERT ON stage FOR EACH ROW
BEGIN
  INSERT IGNORE INTO review( create_timestamp, reqn_id, amendment, review_type_id )
  SELECT NULL, NEW.reqn_id, reqn_version.amendment, review_type.id
  FROM review_type
  JOIN stage_type ON review_type.stage_type_id = stage_type.id
  JOIN reqn_current_reqn_version ON NEW.reqn_id = reqn_current_reqn_version.reqn_id
  JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
  WHERE stage_type.id = NEW.stage_type_id;
END$$

DROP TRIGGER IF EXISTS stage_AFTER_DELETE $$

CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_DELETE AFTER DELETE ON stage FOR EACH ROW
BEGIN
  -- delete all reviews belonging to the reqn associated with the stage_type
  DELETE FROM review
  WHERE review_type_id IN (
    SELECT review_type.id
    FROM review_type
    JOIN stage_type ON review_type.stage_type_id = stage_type.id
    WHERE stage_type.id = OLD.stage_type_id
  ) AND amendment = (
    SELECT amendment
    FROM reqn_current_reqn_version
    JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
    WHERE reqn_current_reqn_version.reqn_id = OLD.reqn_id
  )
  AND reqn_id = OLD.reqn_id;
END$$

DELIMITER ;
