CREATE TRIGGER fee_schedule_AFTER_INSERT AFTER INSERT ON fee_schedule FOR EACH ROW
BEGIN
  SELECT MAX(datetime) INTO @max_datetime FROM fee_schedule WHERE datetime < NEW.datetime;

  IF @max_datetime IS NOT NULL THEN
    SELECT id INTO @last_fee_schedule_id FROM fee_schedule WHERE datetime = @max_datetime;

    INSERT INTO additional_fee_fee_schedule(additional_fee_id, fee_schedule_id, fee)
    SELECT * FROM (
      SELECT additional_fee_id, NEW.id, fee
      FROM additional_fee_fee_schedule
      WHERE fee_schedule_id = @last_fee_schedule_id
    ) AS temp;

    INSERT INTO amendment_type_fee_schedule(amendment_type_id, fee_schedule_id, fee_national, fee_international)
    SELECT * FROM (
      SELECT amendment_type_id, NEW.id, fee_national, fee_international
      FROM amendment_type_fee_schedule
      WHERE fee_schedule_id = @last_fee_schedule_id
    ) AS temp;

    INSERT INTO data_selection_fee_schedule(data_selection_id, fee_schedule_id, fee)
    SELECT * FROM (
      SELECT data_selection_id, NEW.id, fee
      FROM data_selection_fee_schedule
      WHERE fee_schedule_id = @last_fee_schedule_id
    ) AS temp;
  ELSE
    INSERT INTO additional_fee_fee_schedule(additional_fee_id, fee_schedule_id)
    SELECT id, NEW.id FROM additional_fee;

    INSERT INTO amendment_type_fee_schedule(amendment_type_id, fee_schedule_id)
    SELECT id, NEW.id FROM amendment_type;

    INSERT INTO data_selection_fee_schedule(data_selection_id, fee_schedule_id)
    SELECT id, NEW.id FROM data_selection;
  END IF;
END ;;