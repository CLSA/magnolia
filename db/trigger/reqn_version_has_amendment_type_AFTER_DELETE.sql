CREATE TRIGGER reqn_version_has_amendment_type_AFTER_DELETE AFTER DELETE ON reqn_version_has_amendment_type FOR EACH ROW
BEGIN

  DELETE FROM amendment_justification
  WHERE reqn_version_id = OLD.reqn_version_id
  AND amendment_type_id = OLD.amendment_type_id;
END ;;
