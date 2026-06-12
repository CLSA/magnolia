CREATE TRIGGER manuscript_stage_AFTER_DELETE AFTER DELETE ON manuscript_stage FOR EACH ROW
BEGIN
  DELETE FROM manuscript_review
  WHERE manuscript_review_type_id IN (
    SELECT manuscript_review_type.id
    FROM manuscript_review_type
    JOIN manuscript_stage_type ON manuscript_review_type.manuscript_stage_type_id = manuscript_stage_type.id
    WHERE manuscript_stage_type.id = OLD.manuscript_stage_type_id
  )
  AND manuscript_id = OLD.manuscript_id;
END ;;
