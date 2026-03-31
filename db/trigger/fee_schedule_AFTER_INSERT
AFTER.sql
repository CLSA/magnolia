CREATE TRIGGER fee_schedule_AFTER_INSERT
AFTER INSERT ON fee_schedule FOR EACH ROW
BEGIN
  SELECT MAX(datetime) INTO @max_datetime FROM fee_schedule WHERE datetime < NEW.datetime;