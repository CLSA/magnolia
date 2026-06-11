CREATE TRIGGER reqn_AFTER_INSERT AFTER INSERT ON reqn FOR EACH ROW BEGIN
  CALL update_reqn_last_ethics_approval( NEW.id );
  CALL update_reqn_current_final_report( NEW.id );
  CALL update_reqn_current_destruction_report( NEW.id );
END ;;