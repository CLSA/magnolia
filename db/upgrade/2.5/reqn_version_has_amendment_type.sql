DROP PROCEDURE IF EXISTS patch_reqn_version_has_amendment_type;
DELIMITER //
CREATE PROCEDURE patch_reqn_version_has_amendment_type()
  BEGIN

    SELECT "Changing constraint in reqn_version_has_amendment_type table" AS "";

    SELECT UPDATE_RULE INTO @update_rule
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE constraint_schema = DATABASE()
    AND constraint_name = "fk_reqn_version_has_amendment_type_reqn_version_id";

    IF @update_rule = "NO ACTION" THEN
      ALTER TABLE reqn_version_has_amendment_type DROP FOREIGN KEY fk_reqn_version_has_amendment_type_reqn_version_id;
      ALTER TABLE reqn_version_has_amendment_type ADD CONSTRAINT fk_reqn_version_has_amendment_type_reqn_version_id
        FOREIGN KEY (reqn_version_id)
        REFERENCES reqn_version (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version_has_amendment_type();
DROP PROCEDURE IF EXISTS patch_reqn_version_has_amendment_type;
