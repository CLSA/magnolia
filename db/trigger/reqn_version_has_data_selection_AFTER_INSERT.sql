CREATE TRIGGER reqn_version_has_data_selection_AFTER_INSERT AFTER INSERT ON reqn_version_has_data_selection FOR EACH ROW
BEGIN
  SELECT data_option_id INTO @data_option_id FROM data_selection WHERE id = NEW.data_selection_id;

  INSERT IGNORE INTO data_justification
  SET reqn_version_id = NEW.reqn_version_id,
      data_option_id = @data_option_id;
END ;;
