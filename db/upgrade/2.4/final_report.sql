DROP PROCEDURE IF EXISTS patch_final_report;
DELIMITER //
CREATE PROCEDURE patch_final_report()
  BEGIN

    SELECT "Changing foreign key in final_report table from reqn to reqn_version" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "final_report"
    AND column_name = "reqn_id";

    IF @test THEN

      ALTER TABLE final_report
      ADD COLUMN reqn_version_id INT UNSIGNED NOT NULL AFTER reqn_id,
      ADD INDEX fk_reqn_version_id (reqn_version_id ASC);

      UPDATE final_report
      JOIN reqn ON final_report.reqn_id = reqn.id
      JOIN reqn_current_reqn_version ON reqn.id = reqn_current_reqn_version.reqn_id
      SET final_report.reqn_version_id = reqn_current_reqn_version.reqn_version_id;

      ALTER TABLE final_report
      ADD UNIQUE INDEX uq_reqn_version_id (reqn_version_id ASC),
      ADD CONSTRAINT fk_final_report_reqn_version_id
      FOREIGN KEY (reqn_version_id)
      REFERENCES reqn_version (id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

      ALTER TABLE final_report
      DROP INDEX uq_reqn_id,
      DROP FOREIGN KEY fk_final_report_reqn_id,
      DROP INDEX fk_reqn_id,
      DROP COLUMN reqn_id;

    END IF;

  END //
DELIMITER ;

CALL patch_final_report();
DROP PROCEDURE IF EXISTS patch_final_report;
