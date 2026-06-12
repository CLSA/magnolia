CREATE TRIGGER destruction_report_AFTER_INSERT AFTER INSERT ON destruction_report
FOR EACH ROW
BEGIN
  CALL update_reqn_current_destruction_report( NEW.reqn_id );
END ;;
