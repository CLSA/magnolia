CREATE TRIGGER manuscript_BEFORE_UPDATE BEFORE UPDATE ON manuscript FOR EACH ROW
BEGIN
  IF !( NEW.deferred <=> OLD.deferred ) THEN
    SET NEW.deferred_date = IF( NEW.deferred, UTC_TIMESTAMP(), NULL );
  END IF;
END ;;
