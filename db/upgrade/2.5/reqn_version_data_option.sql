DROP PROCEDURE IF EXISTS patch_reqn_version_data_option;
DELIMITER //
CREATE PROCEDURE patch_reqn_version_data_option()
  BEGIN

    SELECT "Changing constraint in reqn_version_data_option table" AS "";

    SELECT UPDATE_RULE INTO @update_rule
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE constraint_schema = DATABASE()
    AND constraint_name = "fk_reqn_version_data_option_data_option_id";

    IF @update_rule = "CASCADE" THEN
      ALTER TABLE reqn_version_data_option DROP FOREIGN KEY fk_reqn_version_data_option_data_option_id;
      ALTER TABLE reqn_version_data_option ADD CONSTRAINT fk_reqn_version_data_option_data_option_id
        FOREIGN KEY (data_option_id)
        REFERENCES data_option (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
    END IF;

    SELECT UPDATE_RULE INTO @update_rule
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE constraint_schema = DATABASE()
    AND constraint_name = "fk_reqn_version_data_option_study_phase_id";

    IF @update_rule = "CASCADE" THEN
      ALTER TABLE reqn_version_data_option DROP FOREIGN KEY fk_reqn_version_data_option_study_phase_id;
      SET @sql = CONCAT(
        "ALTER TABLE reqn_version_data_option ADD CONSTRAINT fk_reqn_version_data_option_study_phase_id ",
          "FOREIGN KEY (study_phase_id) ",
          "REFERENCES ", @cenozo, ".study_phase (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version_data_option();
DROP PROCEDURE IF EXISTS patch_reqn_version_data_option;
