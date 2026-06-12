CREATE TRIGGER data_category_AFTER_INSERT AFTER INSERT ON data_category FOR EACH ROW
BEGIN
  IF NEW.comment THEN
    INSERT INTO reqn_version_comment( reqn_version_id, data_category_id )
    SELECT reqn_version.id, NEW.id
    FROM reqn_version;
  END IF;
END ;;
