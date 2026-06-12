CREATE TRIGGER data_selection_AFTER_INSERT AFTER INSERT ON data_selection FOR EACH ROW
BEGIN
  INSERT INTO data_selection_fee_schedule(data_selection_id, fee_schedule_id)
  SELECT NEW.id, id FROM fee_schedule;
END ;;
