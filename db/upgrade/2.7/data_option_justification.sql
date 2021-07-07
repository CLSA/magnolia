DROP PROCEDURE IF EXISTS patch_data_option_justification;
DELIMITER //
CREATE PROCEDURE patch_data_option_justification()
  BEGIN

    SELECT "Renaming reqn_version_justification table to data_option_justification" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version_justification";

    IF @test = 1 THEN
      RENAME TABLE reqn_version_justification TO data_option_justification;

      -- now rename the foreign keys
      ALTER TABLE data_option_justification
      DROP CONSTRAINT fk_reqn_version_justification_data_option_id,
      DROP CONSTRAINT fk_reqn_version_justification_reqn_version_id;

      ALTER TABLE data_option_justification
      ADD CONSTRAINT fk_data_option_justification_data_option_id
        FOREIGN KEY (data_option_id)
        REFERENCES data_option (id)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
      ADD CONSTRAINT fk_data_option_justification_reqn_version_id
        FOREIGN KEY (reqn_version_id)
        REFERENCES reqn_version (id)
        ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;

  END //
DELIMITER ;

CALL patch_data_option_justification();
DROP PROCEDURE IF EXISTS patch_data_option_justification;
