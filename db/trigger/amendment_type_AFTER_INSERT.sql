CREATE TRIGGER amendment_type_AFTER_INSERT AFTER INSERT ON amendment_type FOR EACH ROW
BEGIN
  INSERT INTO amendment_type_fee_schedule(amendment_type_id, fee_schedule_id)
  SELECT NEW.id, id FROM fee_schedule;
END ;;