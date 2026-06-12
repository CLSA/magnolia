CREATE TRIGGER ethics_approval_AFTER_INSERT AFTER INSERT ON ethics_approval FOR EACH ROW
BEGIN
  CALL update_reqn_last_ethics_approval( NEW.reqn_id );
END ;;
