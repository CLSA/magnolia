CREATE TRIGGER destruction_report_AFTER_DELETE AFTER DELETE ON destruction_report
FOR EACH ROW
BEGIN
  CALL update_reqn_current_destruction_report( OLD.reqn_id );
END ;;