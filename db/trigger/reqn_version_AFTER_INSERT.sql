CREATE TRIGGER reqn_version_AFTER_INSERT AFTER INSERT ON reqn_version FOR EACH ROW
BEGIN
  SELECT reqn_id INTO @reqn_id
  FROM amendment
  JOIN reqn_version ON amendment.id = reqn_version.amendment_id
  WHERE reqn_version.id = NEW.id;

  CALL update_reqn_last_amendment_with_agreement( @reqn_id );
  CALL update_amendment_current_reqn_version( NEW.amendment_id );

  INSERT INTO reqn_version_comment( reqn_version_id, data_category_id )
  SELECT NEW.id, data_category.id
  FROM data_category
  WHERE comment = true;
END ;;
