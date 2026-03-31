CREATE TRIGGER stage_AFTER_DELETE
AFTER DELETE ON magnolia.stage FOR EACH ROW
BEGIN
  DELETE FROM review
  WHERE review_type_id IN (
    SELECT review_type.id
    FROM review_type
    JOIN stage_type ON review_type.stage_type_id = stage_type.id
    WHERE stage_type.id = OLD.stage_type_id
  )
  AND amendment_id = OLD.amendment_id;
END$$