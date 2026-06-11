CREATE TRIGGER amendment_AFTER_INSERT AFTER INSERT ON amendment FOR EACH ROW
BEGIN
  CALL update_reqn_current_amendment( NEW.reqn_id );
END ;;