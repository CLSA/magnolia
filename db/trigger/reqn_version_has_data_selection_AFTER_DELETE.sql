CREATE TRIGGER reqn_version_has_data_selection_AFTER_DELETE AFTER DELETE ON reqn_version_has_data_selection FOR EACH ROW
BEGIN
  SELECT data_option_id INTO @data_option_id FROM data_selection WHERE id = OLD.data_selection_id;

  SELECT COUNT(*) INTO @count
  FROM reqn_version_has_data_selection
  JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
  WHERE reqn_version_id = OLD.reqn_version_id
  AND data_option_id = @data_option_id;

  IF 0 = @count THEN
    DELETE FROM data_justification
    WHERE reqn_version_id = OLD.reqn_version_id
    AND data_option_id = (
      SELECT data_option_id FROM data_selection WHERE id = OLD.data_selection_id
    );
  END IF;
END ;;