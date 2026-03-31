CREATE TRIGGER manuscript_version_AFTER_INSERT
AFTER INSERT ON manuscript_version FOR EACH ROW
BEGIN
  CALL update_manuscript_current_manuscript_version( NEW.manuscript_id );
END$$