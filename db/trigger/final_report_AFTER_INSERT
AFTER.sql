CREATE TRIGGER final_report_AFTER_INSERT
AFTER INSERT ON magnolia.final_report FOR EACH ROW
BEGIN
  CALL update_reqn_current_final_report( NEW.reqn_id );
END$$