CREATE TRIGGER ethics_approval_AFTER_DELETE AFTER DELETE ON ethics_approval FOR EACH ROW
BEGIN
  CALL update_reqn_last_ethics_approval( OLD.reqn_id );
END ;;
