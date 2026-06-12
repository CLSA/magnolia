CREATE TRIGGER final_report_AFTER_DELETE AFTER DELETE ON final_report FOR EACH ROW
BEGIN
  CALL update_reqn_current_final_report( OLD.reqn_id );
END ;;
