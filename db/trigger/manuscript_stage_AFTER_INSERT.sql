CREATE TRIGGER manuscript_stage_AFTER_INSERT AFTER INSERT ON manuscript_stage FOR EACH ROW
BEGIN
  INSERT IGNORE INTO manuscript_review( manuscript_id, manuscript_review_type_id )
  SELECT NEW.manuscript_id, manuscript_review_type.id
  FROM manuscript_review_type
  JOIN manuscript_stage_type ON manuscript_review_type.manuscript_stage_type_id = manuscript_stage_type.id
  JOIN manuscript_current_manuscript_version ON NEW.manuscript_id = manuscript_current_manuscript_version.manuscript_id
  JOIN manuscript_version ON manuscript_current_manuscript_version.manuscript_version_id = manuscript_version.id
  WHERE manuscript_stage_type.id = NEW.manuscript_stage_type_id;
END ;;