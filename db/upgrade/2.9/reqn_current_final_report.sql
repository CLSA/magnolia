DROP PROCEDURE IF EXISTS patch_reqn_current_final_report;
DELIMITER //
CREATE PROCEDURE patch_reqn_current_final_report()
  BEGIN

    SELECT "Changing foreign key actions in reqn_current_final_report table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE constraint_schema = DATABASE()
    AND constraint_name = "fk_reqn_current_final_report_final_report_id"
    AND delete_rule = "NO ACTION";

    IF @test = 1 THEN
      ALTER TABLE reqn_current_final_report
      DROP CONSTRAINT fk_reqn_current_final_report_final_report_id;
      ALTER TABLE reqn_current_final_report
      ADD CONSTRAINT fk_reqn_current_final_report_final_report_id
        FOREIGN KEY (final_report_id)
        REFERENCES final_report (id)
        ON DELETE SET NULL 
        ON UPDATE NO ACTION;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE constraint_schema = DATABASE()
    AND constraint_name = "fk_reqn_current_final_report_reqn_id"
    AND update_rule = "CASCADE";

    IF @test = 1 THEN
      ALTER TABLE reqn_current_final_report
      DROP CONSTRAINT fk_reqn_current_final_report_reqn_id;
      ALTER TABLE reqn_current_final_report
      ADD CONSTRAINT fk_reqn_current_final_report_reqn_id
        FOREIGN KEY (reqn_id)
        REFERENCES reqn (id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_current_final_report();
DROP PROCEDURE IF EXISTS patch_reqn_current_final_report;
