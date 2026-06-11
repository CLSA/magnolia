CREATE TRIGGER stage_AFTER_INSERT AFTER INSERT ON stage FOR EACH ROW
BEGIN
  INSERT IGNORE INTO review( amendment_id, review_type_id )
  SELECT NEW.amendment_id, review_type.id
  FROM review_type
  JOIN stage_type ON review_type.stage_type_id = stage_type.id
  WHERE stage_type.id = NEW.stage_type_id;
END ;;