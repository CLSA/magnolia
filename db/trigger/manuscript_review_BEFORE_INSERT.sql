CREATE TRIGGER manuscript_review_BEFORE_INSERT BEFORE INSERT ON manuscript_review FOR EACH ROW
BEGIN
  IF !NEW.datetime THEN
    SET NEW.datetime = UTC_TIMESTAMP();
  END IF;
END ;;
