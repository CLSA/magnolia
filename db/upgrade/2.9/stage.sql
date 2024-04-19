SELECT "Correcting stage_AFTER_INSERT trigger" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS stage_AFTER_INSERT $$
CREATE DEFINER=CURRENT_USER TRIGGER stage_AFTER_INSERT AFTER INSERT ON stage FOR EACH ROW
BEGIN
  INSERT IGNORE INTO review( reqn_id, amendment, review_type_id )
  SELECT NEW.reqn_id, reqn_version.amendment, review_type.id
  FROM review_type
  JOIN stage_type ON review_type.stage_type_id = stage_type.id
  JOIN reqn_current_reqn_version ON NEW.reqn_id = reqn_current_reqn_version.reqn_id
  JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
  WHERE stage_type.id = NEW.stage_type_id;
END$$

DELIMITER ;
