CREATE TRIGGER amendment_AFTER_DELETE
AFTER DELETE ON amendment FOR EACH ROW
BEGIN
  CALL update_reqn_current_amendment( OLD.reqn_id );
END$$