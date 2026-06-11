CREATE TRIGGER additional_fee_AFTER_INSERT AFTER INSERT ON additional_fee FOR EACH ROW
BEGIN
  INSERT INTO additional_fee_fee_schedule(additional_fee_id, fee_schedule_id)
  SELECT NEW.id, id FROM fee_schedule;
END ;;