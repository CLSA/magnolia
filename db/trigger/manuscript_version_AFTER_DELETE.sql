CREATE TRIGGER manuscript_version_AFTER_DELETE
AFTER DELETE ON manuscript_version FOR EACH ROW
BEGIN
  CALL update_manuscript_current_manuscript_version( OLD.manuscript_id );
END$$